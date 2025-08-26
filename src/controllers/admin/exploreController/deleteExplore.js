const Explore = require("../../../models/explore");
const catchAsync = require("../../../utils/catchAsync");

// Delete
exports.deleteExplore = catchAsync(async (req, res) => {
    const explore = await Explore.findByIdAndDelete(req.params.id);
    if (!explore) throw new AppError("Explore not found", 404);

    return res.status(200).json({
        status: true,
        message: "Explore deleted successfully",
    });
});
