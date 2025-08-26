const Explore = require("../../../models/explore");
const ExploreSection = require("../../../models/exploreSection");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

// Create ExploreSection
exports.assignProductToExploreSection = catchAsync(async (req, res, next) => {
    const { exploreSectionId, productIds } = req.body;

    // if (!name || !name.trim()) throw new AppError("Section name is required", 400);

    // const section = new ExploreSection({
    //     name,
    //     exploreId,
    //     products: products || [],
    // });
    // await section.save();

    console.log("exploreSectionId", exploreSectionId);
    console.log("--------------------------------")
    console.log("productIds", productIds);
    // return;

    const exploreSection = await ExploreSection.findById(exploreSectionId);
    if (!exploreSection) {
        return next(new AppError("Explore section not found", 404));
    }

    // Check if productIds is an array and has at least one product ID
    if (!Array.isArray(productIds) || productIds.length === 0) {
        return next(new AppError("At least one product ID is required", 400));
    }

    // Add product IDs to the explore section
    exploreSection.products.push(...productIds);
    await exploreSection.save();

    // const exploreData = await Explore.findById(exploreId);
    // exploreData.sections.push(section._id);
    // await exploreData.save();


    return res.status(201).json({
        status: true,
        message: "product added successfully",
        data: { exploreSection },
    });
});






