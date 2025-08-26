const Setting = require("../../../models/settings");
const catchAsync = require("../../../utils/catchAsync");

exports.getSettings = catchAsync(async (req, res) => {

    try {

        const type = req.query.type;
        const settings = await Setting.find();
        return res.status(200).json({
            status: true,
            message: "Settings",
            data: { settings }
        });
    } catch (error) {
        return res.status(500).json({ status: false, message: "Something went wrong", error: error.message });
    }

})