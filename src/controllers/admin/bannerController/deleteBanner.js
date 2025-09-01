const fs = require("fs");
const path = require("path");
const Banner = require("../../../models/dealBanner");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.deleteBanner = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // === Validate banner ID ===
  if (!id) {
    return next(new AppError("Banner ID is required", 400));
  }

  // === Find banner by ID ===
  const bannerData = await Banner.findById(id);

  if (!bannerData) {
    return next(new AppError("Banner not found", 404));
  }

  // === Optionally delete old image file ===
  // const imagePath = path.join(__dirname, "../../../", bannerData.image);
  // if (fs.existsSync(imagePath)) {
  //     fs.unlinkSync(imagePath); // deletes the image file
  // }

  // === Delete banner from database ===
  await Banner.findByIdAndDelete(id);

  // === Return success response ===
  return res.status(200).json({
    status: true,
    message: "Banner deleted successfully",
    data: bannerData,
  });
});
