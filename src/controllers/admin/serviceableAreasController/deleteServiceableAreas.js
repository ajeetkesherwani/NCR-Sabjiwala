const serviceableAreas = require("../../../models/serviceableAreas");
const catchAsync = require("../../../utils/catchAsync");

exports.deleteServiceableAreas = catchAsync(async (req, res) => {
    try {
        const { id } = req.params
        const area = await serviceableAreas.findByIdAndDelete(id);
        if (!area) return res.status(404).json({ error: "Service area not found" });
        res.status(200).json({
            success: true,
            message: "Serviceable area deleted",
            area
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});