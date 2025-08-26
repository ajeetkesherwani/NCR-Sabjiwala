const ExploreSection = require("../../../models/exploreSection");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

// Get All
exports.getAllSections = catchAsync(async (req, res) => {
    const sections = await ExploreSection.find().populate("products");

    return res.status(200).json({
        status: true,
        data: sections,
    });
});