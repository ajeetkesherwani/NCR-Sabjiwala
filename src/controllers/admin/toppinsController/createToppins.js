const Toppins = require("../../../models/toppins");
const catchAsync = require("../../../utils/catchAsync");

exports.addToppins = catchAsync(async (req, res) => {
    try {
        const { name, price } = req.body;

        if (!name || !price) {
            return res.status(400).json({
                status: false,
                message: "Name and price are required",
            });
        }

        const newToppins = new Toppins({ name, price });
        await newToppins.save();

        return res.status(201).json({
            success: true,
            message: "Toppins added successfully",
            data: { newToppins }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Something went wrong", error: error.message });
    }
});