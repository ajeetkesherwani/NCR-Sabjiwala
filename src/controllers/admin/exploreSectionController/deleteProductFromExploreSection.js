const ExploreSection = require("../../../models/exploreSection");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.deleteProductFromExploreSection = catchAsync(async (req, res) => {

    let { exploreSectionId, productId } = req.body;

    if (!exploreSectionId || !productId) {
        throw new AppError("exploreSectionId and productId are required", 400);
    }

    const exploreSection = await ExploreSection.findById(exploreSectionId);

    exploreSection.products = exploreSection.products.filter(
        (product) => product.toString() !== productId.toString()
    );
    await exploreSection.save();

    return res.status(200).json({
        status: true,
        message: "Product removed from explore section successfully",
        data: { exploreSection },
    });
});