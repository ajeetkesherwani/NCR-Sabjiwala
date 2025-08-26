const Explore = require("../../../models/explore");
const catchAsync = require("../../../utils/catchAsync");



// Update
exports.updateExplore = catchAsync(async (req, res) => {
    const { name, couponCode } = req.body;

    const explore = await Explore.findById(req.params.id);
    if (!explore) throw new AppError("Explore not found", 404);

    if (req.files?.icon?.[0]) {
        explore.icon = `${req.files.icon[0].destination}/${req.files.icon[0].filename}`;
    }

    if (req.files?.banner?.[0]) {
        explore.bannerImg = `${req.files.banner[0].destination}/${req.files.banner[0].filename}`;
    }

    if (name) explore.name = name;
    if (couponCode !== undefined) explore.couponCode = couponCode;

    await explore.save();

    return res.status(200).json({
        status: true,
        message: "Explore updated successfully",
        data: { explore },
    });
});