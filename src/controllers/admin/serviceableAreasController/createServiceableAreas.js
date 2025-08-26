const serviceableAreas = require("../../../models/serviceableAreas");
const catchAsync = require("../../../utils/catchAsync");

exports.createServiceabelAreas = catchAsync(async (req, res) => {
    try {
        const { pincode, city, state, isFoodAvailable, isGroceryAvailable } = req.body
        const area = new serviceableAreas({ pincode, city, state, isFoodAvailable, isGroceryAvailable });
        await area.save();
        res.status(200).json({
            success: true,
            message: "Serviceable area created",
            area
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});