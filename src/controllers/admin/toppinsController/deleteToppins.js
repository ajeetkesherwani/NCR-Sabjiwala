const Toppins = require("../../../models/toppins");
const catchAsync = require("../../../utils/catchAsync");

exports.deleteToppins = catchAsync(async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Toppins.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ success: false, message: "Toppins not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Toppins deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Something went wrong", error: error.message });
    }
});