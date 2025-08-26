const banner = require("../../../models/banner");
const Category = require("../../../models/category");
const Driver = require("../../../models/driver");
const newOrder = require("../../../models/newOrder");
const Product = require("../../../models/product");
const Service = require("../../../models/service");
const User = require("../../../models/user");
const Vendor = require("../../../models/vendor");
const VendorProduct = require("../../../models/vendorProduct");
const catchAsync = require("../../../utils/catchAsync");

exports.getAllData = catchAsync(async (req, res, next) => {
    try {

        const categories = await Category.find({ cat_id: null }).populate({ path: "serviceId", select: "name" });

        // let categoryWithProduct = [];
        // for (let category of categories) {
        //     const count = await Product.countDocuments({ categoryId: category._id })
        //     categoryWithProduct.push({ ...category._doc, productCount: count })
        // }

        const subCategories = await Category.find({ cat_id: { $ne: null } });
        // let subCategoryWithProduct = [];
        // for (let subCategory of subCategories) {
        //     const count = await Product.countDocuments({ subCategoryId: subCategory._id })
        //     subCategoryWithProduct.push({ ...subCategory._doc, productCount: count })
        // }

        const services = await Service.find();
        const productCount = [];
        for (let service of services) {
            const count = await Product.countDocuments({ serviceId: service._id })
            productCount.push({ name: service.name, productCount: count })
        }

        const vendorCount = await Vendor.countDocuments()
        const bannerCount = await banner.countDocuments()
        const userCount = await User.countDocuments()

        const bannerCount = await banner.countDocuments();
        const driverCount = await Driver.countDocuments();
        const userCount = await User.countDocuments();
        const orderCount = await newOrder.countDocuments();

        let countData = {
<<<<<<< HEAD
            banner: bannerCount || 10,
=======
            banner: bannerCount,
>>>>>>> 506cc98bccb177dbb020d33ce27de1504c36e82b
            category: categories.length,
            subCategory: subCategories.length,
            food: productCount[0].productCount,
            grocery: productCount[1].productCount,
            vendor: vendorCount,
<<<<<<< HEAD
            driver: driverCount || 10,
            user: userCount || 10,
            order: orderCount || 10
=======
            user: userCount
>>>>>>> 506cc98bccb177dbb020d33ce27de1504c36e82b
        }

        return res.status(200).json({ success: true, message: "Data found", data: { countData } })

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
})