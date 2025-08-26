const Brand = require("../../../models/brand");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.createBrand = catchAsync(async (req, res, next) => {
    let { name } = req.body;

    if (!name || !name.trim()) return new AppError(`name is required.`, 400);

    let imagePath;
    if (req.files && req.files.image) {
        const url = `${req.files.image[0].destination}/${req.files.image[0].filename}`;
        imagePath = url;
    } else {
        imagePath = ""
    }

    let brand = new Brand({ name, image: imagePath });
    await brand.save()

    return res.status(201).json({
        status: true,
        message: "Brand added successfully",
        data: { brand },
        newBrand: true,
    });
})