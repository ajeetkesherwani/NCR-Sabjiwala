const Vendor = require("../../../models/vendor");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.updateVendorDocument = catchAsync(async (req, res, next) => {
    try {
        const vendorId = req.vendor._id;

        const { panNo, gstNo, foodLicense } = req.body;

        const vendor = await Vendor.findById(vendorId);
        if (!vendor) return next(new AppError("Vendor not found.", 404));

        vendor.panNo = panNo || vendor.panNo
        vendor.gstNo = gstNo || vendor.gstNo
        vendor.foodLicense = foodLicense || vendor.foodLicense
        if (req.files.panImage) {
            vendor.panImage = req.files.panImage[0].path
        }
        if (req.files.gstImage) {
            vendor.gstImage = req.files.gstImage[0].path
        }
        if (req.files.foodImage) {
            vendor.foodImage = req.files.foodImage[0].path
        }
        await vendor.save();

        return res.status(200).json({
            status: true,
            message: "Document updated successfully"
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
