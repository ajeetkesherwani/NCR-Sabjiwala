const serviceableAreas = require("../../../models/serviceableAreas");
const catchAsync = require("../../../utils/catchAsync");

exports.updateServiceableAreas = catchAsync(async (req, res) => {
    try {
        const { pincode, city, state, status } = req.body
        const { id } = req.params
        const area = await serviceableAreas.findOneAndUpdate({ _id: id }, { pincode, city, state, status }, { new: true });
        res.status(200).json({
            success: true,
            message: "Serviceable area updated",
            area
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});