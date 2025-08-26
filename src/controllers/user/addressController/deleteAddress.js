const Address = require("../../../models/address");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.deleteAddress = catchAsync(async (req, res, next) => {
    const { addressId } = req.params;
    const userId = req.user._id;

    const address = await Address.findOneAndDelete({ _id: addressId, userId });
    if (!address) return next(new AppError("Address not found", 404));

    return res.status(200).json({
        status: true,
        message: "Address deleted successfully",
    });
});
