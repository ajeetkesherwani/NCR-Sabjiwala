const Toppins = require("../../../models/toppins");
const catchAsync = require("../../../utils/catchAsync");

exports.getToppins = catchAsync(async (req, res) => {
    try {
        const { productId } = req.params;
        const toppins = await Toppins.find({ productId }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Toppins fetched successfully",
            data: toppins
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Something went wrong", error: error.message });
    }
});