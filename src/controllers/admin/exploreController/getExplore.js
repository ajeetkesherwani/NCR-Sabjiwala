const Explore = require("../../../models/explore");
const catchAsync = require("../../../utils/catchAsync");


// Get Single
exports.getExplore = catchAsync(async (req, res) => {
    const explore = await Explore.findById(req.params.id);

    if (!explore) throw new AppError("Explore not found", 404);

    return res.status(200).json({
        status: true,
        data: explore,
    });
});