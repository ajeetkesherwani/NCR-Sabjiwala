const Toppins = require("../../../models/toppins");
const catchAsync = require("../../../utils/catchAsync");

exports.getAllToppins = catchAsync(async (req, res) => {
    try {
        const toppins = await Toppins.find().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Toppins fetched successfully",
            data: toppins
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Something went wrong", error: error.message });
    }
});