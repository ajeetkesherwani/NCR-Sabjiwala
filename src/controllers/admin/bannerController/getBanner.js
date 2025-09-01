const Banner = require("../../../models/dealBanner");
const catchAsync = require("../../../utils/catchAsync");

exports.getAllBanners = catchAsync(async (req, res, next) => {
  // === Optional: support filtering via query params ===
  const filter = {};

  if (req.query.serviceId) {
    filter.serviceId = req.query.serviceId;
  }

  if (req.query.section) {
    filter.section = req.query.section;
  }

  // === Fetch all banners with optional filter ===
  const banners = await Banner.find(filter).sort({ createdAt: -1 }); // newest first

  // === Respond with banner list ===
  return res.status(200).json({
    status: true,
    message: "Banners fetched successfully",
    count: banners.length,
    data: banners,
  });
});
