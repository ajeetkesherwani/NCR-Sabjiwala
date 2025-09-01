const path = require("path");
const DealsBanner = require("../../../models/dealBanner");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.createDealsBanner = catchAsync(async (req, res, next) => {
  const { image, bannerImages, productIds } = req.body;
  console.log(req.body);
  console.log(req.files);
  if (!productIds) {
    return next(new AppError("Product Id's is required", 400));
  }

  // === Handle image upload ===
  if (req.files?.image?.[0]) {
    imagePath = `${req.files.image[0].destination}/${req.files.image[0].filename}`;
  }

  let bannerImagesPath = [];
  if (req.files && req.files.bannerImages) {
    bannerImagesPath = req.files.bannerImages.map((file) =>
      path.join(file.destination, file.filename).replace(/\\/g, "/")
    );
  }

  // === Create Category or Subcategory ===
  const dealsBannerData = {
    image: imagePath,
    bannerImages: bannerImagesPath,
    productIds: productIds || [],
  };

  const dealBanner = new DealsBanner(dealsBannerData);
  await dealBanner.save();

  // === Send response === //
  return res.status(201).json({
    status: true,
    message: "Deals Banner added successfully",
    data: dealBanner,
  });
});
