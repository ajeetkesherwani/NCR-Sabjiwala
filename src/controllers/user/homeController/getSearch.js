const Category = require("../../../models/category");
const Shop = require("../../../models/shop");
const VendorProduct = require("../../../models/vendorProduct");
const User = require("../../../models/user");
const catchAsync = require("../../../utils/catchAsync");
const { FOOD_SERVICE_ID, MART_SERVICE_ID } = require("../../../utils/constants");

exports.getSearch = catchAsync(async (req, res) => {
    const search = req.query.query;
    let categoriesQuery, shopsQuery, productsQuery;

    // Get logged in user's service type
    const user = await User.findById(req.user._id);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    const serviceId = user.serviceType == 'food' ? FOOD_SERVICE_ID : MART_SERVICE_ID;

    // Set up queries based on whether there's a search term
    if (search) {
        const searchRegex = new RegExp(search, 'i');
        categoriesQuery = Category.find({
            serviceId,
            name: searchRegex,
            status: "active"
        }).select('name image priority').sort({ priority: 1 }).limit(10);

        shopsQuery = Shop.aggregate([
            {
                $lookup: {
                    from: "vendorproducts",
                    let: { shopId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$shopId", "$$shopId"] },
                                serviceId: serviceId,
                                status: "active",
                                $or: [
                                    { name: searchRegex },
                                    { shortDescription: searchRegex }
                                ],
                                isDeleted: false
                            }
                        }
                    ],
                    as: "matchingProducts"
                }
            },
            {
                $match: {
                    serviceId,
                    status: "active",
                    isClose: false,
                    $or: [
                        { name: searchRegex },
                        { address: searchRegex },
                        { $expr: { $gt: [{ $size: "$matchingProducts" }, 0] } }
                    ]
                }
            },
            {
                $addFields: {
                    sortPriority: {
                        $cond: {
                            if: { $eq: ["$priority", null] },
                            then: 11,
                            else: "$priority"
                        }
                    }
                }
            },
            {
                $sort: {
                    sortPriority: 1,
                    _id: 1
                }
            },
            {
                $project: {
                    name: 1,
                    shopImage: 1,
                    address: 1,
                    rating: 1,
                    priority: 1,
                    matchingProductCount: { $size: "$matchingProducts" }
                }
            },
            {
                $limit: 10
            }
        ]);

        productsQuery = VendorProduct.find({
            serviceId,
            $or: [
                { name: searchRegex },
                { shortDescription: searchRegex }
            ],
            status: "active",
            isDeleted: false
        })
            .select('name primary_image shortDescription vendorSellingPrice mrp')
            .populate('shopId', 'name')
            .limit(10);
    } else {
        // If no search query, get top categories by priority
        categoriesQuery = Category.find({
            serviceId,
            status: "active",
            priority: { $gte: 1, $lte: 10 } 
        })
            .select('name image priority')
            .sort({ priority: 1 })
            .limit(10);

        // Get top shops by priority
        shopsQuery = Shop.aggregate([
            {
                $match: {
                    serviceId,
                    status: "active",
                    isClose: false,
                    priority: { $gte: 1, $lte: 10 } 
                }
            },
            {
                $addFields: {
                    sortPriority: {
                        $cond: {
                            if: { $eq: ["$priority", null] },
                            then: 11,
                            else: "$priority"
                        }
                    }
                }
            },
            {
                $sort: {
                    sortPriority: 1,
                    _id: 1
                }
            },
            {
                $limit: 10
            }
        ]);

        // Get one product from each top shop
        const topShops = await Shop.find({
            serviceId,
            status: "active",
            isClose: false
        })
            .sort({ priority: 1 })
            .limit(10)
            .select('_id');

        productsQuery = VendorProduct.aggregate([
            {
                $match: {
                    shopId: { $in: topShops.map(shop => shop._id) },
                    serviceId,
                    status: "active",
                    isDeleted: false
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: "$shopId",
                    product: { $first: "$$ROOT" }
                }
            },
            {
                $replaceRoot: { newRoot: "$product" }
            },
            {
                $lookup: {
                    from: "shops",
                    localField: "shopId",
                    foreignField: "_id",
                    as: "shop"
                }
            },
            {
                $unwind: "$shop"
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    primary_image: 1,
                    shortDescription: 1,
                    vendorSellingPrice: 1,
                    mrp: 1,
                    "shopId.name": "$shop.name"
                }
            }
        ]);
    }

    // Execute queries in parallel
    const [categories, shops, products] = await Promise.all([
        categoriesQuery,
        shopsQuery,
        productsQuery
    ]);

    // Format products to include shop name
    const formattedProducts = products.map(product => ({
        _id: product._id,
        name: product.name,
        image: product.primary_image,
        description: product.shortDescription,
        price: product.vendorSellingPrice,
        mrp: product.mrp,
        shopName: product.shopId?.name || ''
    }));

    // Format shops for consistency
    const formattedShops = shops.map(shop => ({
        _id: shop._id,
        name: shop.name,
        image: shop.shopImage,
        address: shop.address,
        rating: shop.rating || "0",
        priority: shop.priority,
        matchingProductCount: shop.matchingProductCount
    }));

    // Format categories for consistency
    const formattedCategories = categories.map(category => ({
        _id: category._id,
        name: category.name,
        image: category.image
    }));

    return res.status(200).json({
        success: true,
        message: "Search results",
        data: {
            categories: formattedCategories,
            shops: formattedShops,
            products: formattedProducts
        }
    });
});
