const ExploreSection = require("../../../models/exploreSection");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

// Get Single
exports.getSection = catchAsync(async (req, res) => {
    const section = await ExploreSection.findById(req.params.id).populate("products");

    if (!section) throw new AppError("Section not found", 404);

    return res.status(200).json({
        status: true,
        data: section,
    });
});
