const serviceableAreas = require("../../../models/serviceableAreas");
const catchAsync = require("../../../utils/catchAsync");

exports.getServiceableAreas = catchAsync(async (req, res) => {
    try {
        const area = await serviceableAreas.find();

        res.status(200).json({
            success: true,
            message: "Serviceable area fetched",
            area
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});