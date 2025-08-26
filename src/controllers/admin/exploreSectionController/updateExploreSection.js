const ExploreSection = require("../../../models/exploreSection");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

// Update
exports.updateSection = catchAsync(async (req, res) => {
    const { name, products } = req.body;

    const section = await ExploreSection.findById(req.params.id);
    if (!section) throw new AppError("Section not found", 404);

    if (name) section.name = name;
    if (products) section.products = products;

    await section.save();

    return res.status(200).json({
        status: true,
        message: "Section updated successfully",
        data: { section },
    });
});
