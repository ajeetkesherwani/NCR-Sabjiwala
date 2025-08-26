const Vendor = require("../../../models/vendor");
const catchAsync = require("../../../utils/catchAsync");

exports.getVendorWallet = catchAsync(async (req, res, next) => {
    try {

        let vendorId = req.vendor._id

        const wallet = await Vendor.findById(vendorId).select("wallet_balance");

        return res.status(201).json({ message: "Vendor balance", status: "success", wallet });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong", status: "notsuccess", error: error.message });
    }
})