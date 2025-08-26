const Shop = require("../../../models/shop");
const catchAsync = require("../../../utils/catchAsync");

exports.getAllShopWallet = catchAsync(async (req, res, next) => {
    try {

        const vendorId = req.vendor._id;

        const shop_list = await Shop.find({vendorId})

        return res.status(201).json({ message: "Vendor balance", status: "success", shop_list });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong", status: "notsuccess", error: error.message });
    }
})