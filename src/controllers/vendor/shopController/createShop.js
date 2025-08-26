const Shop = require("../../../models/shop");
const catchAsync = require("../../../utils/catchAsync");
const AppError = require("../../../utils/AppError");

exports.createShop = catchAsync(async (req, res, next) => {
    const { name, serviceId, shopType, address, pincode, city, state, lat, long, description, phone, rating, deliveryCharge, packingCharge } = req.body;

    const vendorId = req.vendor._id;

    const files = req.files;
    const shopImage = files.shopImage && files.shopImage[0] ? files.shopImage[0].path : "";
    const galleryImage = files.galleryImage ? files.galleryImage.map(file => file.path) : [];
    const menu = files.menu ? files.menu.map(file => file.path) : [];

    if (!name) return next(new AppError("Name is required.", 404));
    if (!vendorId) return next(new AppError("Vendor is required.", 404));
    if (!shopType) return next(new AppError("Shop type is required.", 404));
    if (!serviceId) return next(new AppError("Service ID is required.", 404));
    if (!address) return next(new AppError("Address is required.", 404));
    if (!lat) return next(new AppError("Latitude is required.", 404));
    if (!long) return next(new AppError("Longitude is required.", 404));
    if (!packingCharge && packingCharge !== 0) return next(new AppError("Packing charge is required.", 404));
    if (!phone) return next(new AppError("Phone number is required.", 404));
    if (galleryImage.length === 0) return next(new AppError("Gallery images are required.", 404));
    if (menu.length === 0) return next(new AppError("Gallery images are required.", 404));

    const location = {
        type: 'Point',
        coordinates: [parseFloat(long), parseFloat(lat)]
    };

    const newShop = await Shop.create({ name, serviceId, vendorId, shopType, shopImage, address, pincode, city, state, lat, long, description, phone, rating, deliveryCharge, packingCharge, menu, location, galleryImage });

    return res.status(201).json({
        success: true,
        message: "Shop created successfully",
        shop: newShop
    });
});
