const Explore = require("../../../models/explore");
const catchAsync = require("../../../utils/catchAsync");


// Create Explore
exports.createExplore = catchAsync(async (req, res) => {
    let { name, couponCode, serviceId } = req.body;

    if (!name || !name.trim()) throw new AppError("name is required", 400);

    let iconPath = "";
    let bannerPath = "";

    if (req.files?.icon?.[0]) {
        iconPath = `${req.files.icon[0].destination}/${req.files.icon[0].filename}`;
    }

    if (req.files?.banner?.[0]) {
        bannerPath = `${req.files.banner[0].destination}/${req.files.banner[0].filename}`;
    }

    const explore = new Explore({
        name,
        icon: iconPath,
        bannerImg: bannerPath,
        couponCode,
        serviceId
    });

    await explore.save();

    return res.status(201).json({
        status: true,
        message: "Explore created successfully",
        data: { explore },
    });
});