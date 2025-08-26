const ExploreSection = require("../../../models/exploreSection");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

// Delete
exports.deleteSection = catchAsync(async (req, res) => {
    const section = await ExploreSection.findByIdAndDelete(req.params.id);
    if (!section) throw new AppError("Section not found", 404);

    return res.status(200).json({
        status: true,
        message: "Section deleted successfully",
    });
});