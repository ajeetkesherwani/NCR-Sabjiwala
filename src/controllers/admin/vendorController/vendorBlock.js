const Vendor = require("../../../models/vendor");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.vendorBlock = catchAsync(async (req, res) => {
    let id = req.params.id
    let { status } = req.body

    let vendor = await Vendor.findOneAndUpdate({_id: id}, { $set: { isBlocked: status } }, { new: true });

    if (!vendor) return new AppError("Vendor not found", 404)

    return res.status(200).json({
        status: true,
        data: { vendor }
    })
})