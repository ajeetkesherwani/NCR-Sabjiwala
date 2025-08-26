const Vendor = require("../../../models/vendor");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.updateVendorProfile = catchAsync(async (req, res, next) => {
    try {
        const vendorId = req.vendor._id;

        const { name, mobile, alternateMobile, email } = req.body;

        const vendor = await Vendor.findById(vendorId);
        if (!vendor) return next(new AppError("Vendor not found.", 404));

        vendor.name = name || vendor.name
        vendor.mobile = mobile || vendor.mobile
        vendor.alternateMobile = alternateMobile || vendor.alternateMobile
        vendor.email = email || vendor.email

        await vendor.save();

        return res.status(200).json({
            status: true,
            message: "Profile updated successfully"
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
