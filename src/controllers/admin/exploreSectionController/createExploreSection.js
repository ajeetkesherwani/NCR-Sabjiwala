const Explore = require("../../../models/explore");
const ExploreSection = require("../../../models/exploreSection");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

// Create ExploreSection
exports.createExploreSection = catchAsync(async (req, res, next) => {
    const { name, products, exploreId } = req.body;

    if (!name || !name.trim()) throw new AppError("Section name is required", 400);

    const section = new ExploreSection({
        name,
        exploreId,
        products: products || [],
    });
    await section.save();

    const exploreData = await Explore.findById(exploreId);
    exploreData.sections.push(section._id);
    await exploreData.save();


    return res.status(201).json({
        status: true,
        message: "Section created successfully",
        data: { section },
    });
});






