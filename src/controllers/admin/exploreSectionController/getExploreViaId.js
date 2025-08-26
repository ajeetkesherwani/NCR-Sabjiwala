const ExploreSection = require("../../../models/exploreSection");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

// Get All
exports.getExploreViaId = catchAsync(async (req, res) => {
    const exploreId = req.params.exploreId;
    if (!exploreId) {
        throw new AppError("Explore ID is required", 400);
    }
    const sections = await ExploreSection.find({exploreId}).populate("products").populate("exploreId", "name");

    return res.status(200).json({
        status: true,
        data: sections,
    });
});