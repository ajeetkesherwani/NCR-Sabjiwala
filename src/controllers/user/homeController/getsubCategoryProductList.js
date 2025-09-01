const User = require("../../../models/user");
const Product = require("../../../models/product");
const { calculateOffer } = require("../../../utils/calculateOffer");
const catchAsync = require("../../../utils/catchAsync");
const paginate = require("../../../utils/paginate");

exports.getsubCategoryProductList = catchAsync(async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).lean();
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const subCategoryId = req.params.subCategoryId;
    let query = {},
      message;
    if (subCategoryId === "all") {
      query = { subCategoryId: { $ne: null } };
      message = "All subcategory products retrieved successfully";
    } else {
      query = { subCategoryId };
      message = "Product List retrieved successfully";
    }

    // Set up pagination options from query params or set default
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    // Call the custom paginate utility, passing in all config
    const paginated = await paginate(Product, query, {
      page,
      limit,
      select: "name images description mrp price subCategoryId variants",
      populate: {
        path: "variants",
        select: "name images price originalPrice discount stock unit",
      },
      sort: { createdAt: -1 },
    });

    if (!paginated.paginateData || paginated.results === 0) {
      return res.status(404).json({
        success: false,
        message: "No product list found for this sub-category",
      });
    }

    return res.status(200).json({
      success: true,
      message,
      ...paginated, // returns pagination metadata and data
    });
  } catch (error) {
    console.error("Error in get sub category data controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});
