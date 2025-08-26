const Toppins = require("../../../models/toppins");
const catchAsync = require("../../../utils/catchAsync");

exports.updateToppins = catchAsync(async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, status } = req.body;

        const updated = await Toppins.findByIdAndUpdate(id, { name, price, status }, { new: true });

        if (!updated) {
            return res.status(404).json({ success: false, message: "Toppins not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Toppins updated successfully",
            data: updated
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Something went wrong", error: error.message });
    }
});