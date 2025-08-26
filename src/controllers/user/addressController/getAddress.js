const Address = require("../../../models/address");
const catchAsync = require("../../../utils/catchAsync");

exports.getAddress = catchAsync(async (req, res, next) => {
    try {

        const userId = req.user._id
        if (!userId) return next(new AppError("User not found", 404));

        const address = await Address.find({ userId }).sort({ createdAt: -1 })
        if (!address) return next(new AppError("Address not found", 404));

        return res.status(200).json({
            status: true,
            message: "Address fetched successfully",
            address,
            deliveryPriceInfo: [
                { range: "0-5", price: 5 },
                { range: "5-10", price: 7 },
                { range: "10-20", price: 9 },
                { range: "20-2000", price: 10 },
            ],
        })

    } catch (error) {
        return res.status(500).json({ status: false, message: "Something went wrong", error: error.message });
    }
})