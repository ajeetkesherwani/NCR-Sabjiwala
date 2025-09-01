const Category = require("../../../models/category");
const catchAsync = require("../../../utils/catchAsync");

exports.getCategory = catchAsync(async (req, res) => {
    // === Aggregate pipeline for top-level categories with subcategory count ===
    const categories = await Category.aggregate([
        {
            $match: { cat_id: null } // Only fetch main categories
        },
        {
            $lookup: {
                from: "categories", // MongoDB auto-pluralizes collection names
                localField: "_id",  // Match category _id
                foreignField: "cat_id", // with subcategory cat_id
                as: "subcategories"
            }
        },
        {
            $addFields: {
                subcategoryCount: { $size: "$subcategories" } // Add count of subcategories
            }
        },
        {
            $project: {
                subcategories: 0 // Exclude subcategories array from response
            }
        },
        {
            $sort: { createdAt: -1 } // Newest categories first
        }
    ]);

    // === Send response ===
    return res.status(200).json({
        status: true,
        message: "Categories fetched successfully",
        results: categories.length,
        data: categories
    });
});
