const Vendor = require("../../../models/vendor");
const catchAsync = require("../../../utils/catchAsync");

exports.vendorApprove = catchAsync(async (req, res) => {
    let id = req.params.id
    let { status, commission, payoutType } = req.body

    const updateFields = {
        status
    };

    if (commission !== undefined && payoutType !== undefined ) {
        updateFields.commission = commission;
        updateFields.payoutType = payoutType;
    }

    const vendor = await Vendor.findOneAndUpdate({ _id: id }, { $set: updateFields }, { new: true });

    if (!vendor) return new AppError("Vendor not found", 404)

    return res.status(200).json({
        status: true,
        data: { vendor }
    })
})