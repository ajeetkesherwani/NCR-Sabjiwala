const path = require("path");
const Banner = require("../../../models/dealBanner");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.createBanner = catchAsync(async (req, res, next) => {
  const { title, serviceId, section } = req.body;

  // === Validate required fields ===
  if (!title || !title.trim()) {
    return next(new AppError("Title is required", 400));
  }

  if (!section || typeof section !== "string" || !section.trim()) {
    return next(new AppError("Section is required", 400));
  }

  // === Handle banner image upload ===
  let imagePath = "";
  if (req.files && req.files.image && req.files.image.length > 0) {
    const file = req.files.image[0];
    // Store relative path using path.join + replace for cross-platform support
    imagePath = path.join(file.destination, file.filename).replace(/\\/g, "/");
  } else {
    return next(new AppError("Banner image is required", 400));
  }

  // === Create and save the banner ===
  const banner = new Banner({
    title: title.trim(),
    serviceId,
    section: section.trim(),
    image: imagePath,
  });

  await banner.save();

  // === Send success response ===
  return res.status(201).json({
    status: true,
    message: "Banner created successfully",
    data: { banner },
  });
});
