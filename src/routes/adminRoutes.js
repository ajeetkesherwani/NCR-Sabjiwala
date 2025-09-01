const express = require("express");
const { signup } = require("../controllers/admin/auth/signup");
const { login } = require("../controllers/admin/auth/login");
const {
  adminAuthenticate,
} = require("../controllers/admin/auth/adminAuthenticate");
const fileUploader = require("../middleware/fileUploader");
const {
  createCategory,
} = require("../controllers/admin/categoryController/createCategory");
const {
  getCategory,
} = require("../controllers/admin/categoryController/getCategory");
const {
  updateCategoryStatus,
} = require("../controllers/admin/categoryController/updateCategoryStatus");
const {
  deleteCategory,
} = require("../controllers/admin/categoryController/deleteCategory");
const {
  updateCategory,
} = require("../controllers/admin/categoryController/updateCategory");
const {
  getSubCategory,
} = require("../controllers/admin/categoryController/getSubCategory");
const {
  getAllSubCategory,
} = require("../controllers/admin/categoryController/getAllSubCategory");
const {
  getAllProduct,
} = require("../controllers/admin/productController/getAllProduct");
const {
  getProductDetail,
} = require("../controllers/admin/productController/getProductDetail");
const {
  updateProductStatus,
} = require("../controllers/admin/productController/updateProductStatus");
const {
  createProduct,
} = require("../controllers/admin/productController/createProduct");
const {
  getProductViaService,
} = require("../controllers/admin/productController/getProductViaService");
const {
  getSettings,
} = require("../controllers/admin/settingController/getSettings");
const {
  addSettings,
} = require("../controllers/admin/settingController/addSettings");
const {
  updateSettings,
} = require("../controllers/admin/settingController/updateSettings");
const {
  getAllData,
} = require("../controllers/admin/dashboardController/getAllData");
const {
  createDriver,
} = require("../controllers/admin/driverController/createDriver");
const {
  getDriver,
} = require("../controllers/admin/driverController/showDriver");
const {
  getWalletRequest,
} = require("../controllers/admin/walletController/getWalletRequest");
const {
  changeStatusWalletRequest,
} = require("../controllers/admin/walletController/changeStatusWalletRequest");
const {
  settleRequest,
} = require("../controllers/admin/walletController/settleRequest");
const getAllOrder = require("../controllers/admin/orderController/getAllOrder");
const {
  createBanner,
} = require("../controllers/admin/bannerController/createBanner");
const {
  getAllBanners,
} = require("../controllers/admin/bannerController/getBanner");
const { getAllUsers } = require("../controllers/admin/userController/getUser");
const { addCms } = require("../controllers/admin/cmsController/addCms");
const { updateCms } = require("../controllers/admin/cmsController/updateCms");
const { getCms } = require("../controllers/admin/cmsController/getCms");
const {
  createExplore,
} = require("../controllers/admin/exploreController/createExplore");
const {
  getAllExplore,
} = require("../controllers/admin/exploreController/getAllExplore");
const {
  updateExplore,
} = require("../controllers/admin/exploreController/updateExplore");
const {
  getExplore,
} = require("../controllers/admin/exploreController/getExplore");
const {
  deleteExplore,
} = require("../controllers/admin/exploreController/deleteExplore");
const {
  createExploreSection,
} = require("../controllers/admin/exploreSectionController/createExploreSection");
const {
  getAllSections,
} = require("../controllers/admin/exploreSectionController/getAllExploreSection");
const {
  getSection,
} = require("../controllers/admin/exploreSectionController/getExploreSection");
const {
  updateSection,
} = require("../controllers/admin/exploreSectionController/updateExploreSection");
const {
  deleteSection,
} = require("../controllers/admin/exploreSectionController/deleteExploreSection");
const {
  orderComplete,
} = require("../controllers/admin/orderController/orderComplete");
const {
  createCoupon,
} = require("../controllers/admin/couponController/createCoupon");
const {
  getAllCoupons,
} = require("../controllers/admin/couponController/getAllCoupon");
const {
  updateCoupon,
} = require("../controllers/admin/couponController/updateCoupon");
const {
  deleteCoupon,
} = require("../controllers/admin/couponController/deleteCoupon");
const { getOrder } = require("../controllers/admin/orderController/getOrder");
const {
  assignedDriver,
} = require("../controllers/admin/orderController/assignDriver");
const {
  getAllProductFlag,
} = require("../controllers/admin/productFlag/getAllProduct");
const {
  toggleProductFlag,
} = require("../controllers/admin/productFlag/toggleProductFlag");
const {
  deleteProduct,
} = require("../controllers/admin/productController/deleteProduct");
const {
  updateProduct,
} = require("../controllers/admin/productController/updateProduct");
const {
  getAllProductExplore,
} = require("../controllers/admin/exploreController/getAllProduct");
const {
  getExploreViaId,
} = require("../controllers/admin/exploreSectionController/getExploreViaId");
const {
  deleteProductFromExploreSection,
} = require("../controllers/admin/exploreSectionController/deleteProductFromExploreSection");
const {
  getAllDriverForThisOrder,
} = require("../controllers/admin/orderController/getAllDriverForThisOrder");
const {
  toggleBlockStatus,
} = require("../controllers/admin/driverController/toggleBlockStatus");
const {
  assignProductToExploreSection,
} = require("../controllers/admin/exploreSectionController/assignProductToExploreSection");
const {
  settleDriverWallet,
} = require("../controllers/admin/walletController/settleDriverWallert");
const {
  createServiceabelAreas,
} = require("../controllers/admin/serviceableAreasController/createServiceableAreas");
const {
  getServiceableAreas,
} = require("../controllers/admin/serviceableAreasController/getServiceableAreas");
const {
  updateServiceableAreas,
} = require("../controllers/admin/serviceableAreasController/updateServiceableAreas");
const {
  deleteServiceableAreas,
} = require("../controllers/admin/serviceableAreasController/deleteServiceableAreas");
const {
  deleteBanner,
} = require("../controllers/admin/bannerController/deleteBanner");
const {
  createProductVarient,
} = require("../controllers/admin/productVarientController/createProductVarient");
const {
  getProductVarient,
} = require("../controllers/admin/productVarientController/getProductVarient");
const {
  editProductVarient,
} = require("../controllers/admin/productVarientController/editProductVarient");
const {
  deleteProductVarientImage,
} = require("../controllers/admin/productVarientController/deleteProductVarientImage");
const getAllOrdersCount = require("../controllers/admin/orderController/getAllOrdersCount");
const orderInvoice = require("../controllers/admin/orderController/orderInvoice");
const {
  getRecentTransactions,
} = require("../controllers/admin/dashboardController/getRecentTransactions");
const {
  getNewUsers,
} = require("../controllers/admin/dashboardController/getNewUsers");
const {
  setCategoryOrder,
} = require("../controllers/admin/categoryController/setCategoryOrder");
const {
  deleteProductVarient,
} = require("../controllers/admin/productVarientController/deleteProductVarient");

const {
  createDealsBanner,
} = require("../controllers/admin/DealsBannerController/createDealsBanner");

const { logout } = require("../controllers/admin/auth/logout");
const router = express.Router();

router.get("/test/admin", (req, res) => {
  res.status(200).json({ message: "Admin Route Working" });
});

//------------------------------------------------
// auth
//------------------------------------------------
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/dashboard", adminAuthenticate, getAllData);
router.get("/recent-transactions", getRecentTransactions);
router.get("/new-users", getNewUsers);

//------------------------------------------------
// serviceable Areas
//------------------------------------------------
router.post("/serviceabelArea", createServiceabelAreas);
router.get("/serviceabelArea", getServiceableAreas);
router.patch("/serviceabelArea/:id", updateServiceableAreas);
router.delete("/serviceabelArea/:id", deleteServiceableAreas);

//------------------------------------------------
// banner
//------------------------------------------------
router.post(
  "/banner/create",
  adminAuthenticate,
  fileUploader("banners", [{ name: "image", maxCount: 1 }]),
  createBanner
);
router.get("/banner/list", adminAuthenticate, getAllBanners);
router.delete("/banner/delete/:id", adminAuthenticate, deleteBanner);

//------------------------------------------------
// category
//------------------------------------------------
router.post(
  "/category/create",
  adminAuthenticate,
  fileUploader("category", [{ name: "image", maxCount: 1 }]),
  createCategory
);
router.get("/category/list", adminAuthenticate, getCategory);
router.patch("/category/:id", adminAuthenticate, updateCategoryStatus);
router.patch(
  "/category/update/:id",
  adminAuthenticate,
  fileUploader("category", [{ name: "image", maxCount: 1 }]),
  updateCategory
);
router.post("/category/setorder", adminAuthenticate, setCategoryOrder);
router.delete("/category/delete/:id", adminAuthenticate, deleteCategory);

router.get("/subcategory/list", adminAuthenticate, getAllSubCategory);
router.get("/subcategory/:id", adminAuthenticate, getSubCategory);

//------------------------------------------------
// product
//------------------------------------------------
router.post(
  "/product",
  adminAuthenticate,
  fileUploader("product", [{ name: "images", maxCount: 1 }]),
  createProduct
);
router.get("/product/list", adminAuthenticate, getAllProduct);
router.get("/product/list/:id", adminAuthenticate, getProductViaService);
router.get("/product/:id", adminAuthenticate, getProductDetail);
router.patch(
  "/product/:id",
  fileUploader("product", [{ name: "images", maxCount: 1 }]),
  updateProduct
);
router.patch("/product/:id/toggle-status", updateProductStatus);
router.delete("/product/:id", adminAuthenticate, deleteProduct);

//------------------------------------------------
// product varient
//------------------------------------------------
router.post(
  "/product/:productId/add-varient",
  adminAuthenticate,
  fileUploader("product", [{ name: "images", maxCount: 5 }]),
  createProductVarient
);
router.get(
  "/product/:productId/get-varient",
  adminAuthenticate,
  getProductVarient
);
router.patch(
  "/product/:productId/update-varient/:variantId",
  adminAuthenticate,
  fileUploader("product", [{ name: "images", maxCount: 5 }]),
  editProductVarient
);
router.post(
  "/product/:productId/delete-varient-image/:variantId",
  adminAuthenticate,
  deleteProductVarientImage
);
router.delete(
  "/product/:productId/delete-varient/:variantId",
  adminAuthenticate,
  deleteProductVarient
);

//------------------------------------------------
// explore section
//------------------------------------------------
router.post("/exploresection", adminAuthenticate, createExploreSection);
router.get("/exploresection", getAllSections);
router.get("/exploresection/products", getAllProductExplore);
router.get("/exploresection/:id", getSection);
router.get("/explore/:exploreId/section", getExploreViaId);
router.patch("/exploresection/:id", updateSection);
router.delete("/exploresection/:id", deleteSection);
router.post("/exploresection/product", deleteProductFromExploreSection);
router.post("/exploresection/assign/product", assignProductToExploreSection);

//------------------------------------------------
// product flag
//------------------------------------------------
router.get("/product/flag/list", adminAuthenticate, getAllProductFlag);
router.post("/product/flag/toggle", adminAuthenticate, toggleProductFlag);

//------------------------------------------------
// explore
//------------------------------------------------
router.post(
  "/explore",
  fileUploader("banners", [
    { name: "icon", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  createExplore
);
router.get("/explore", getAllExplore);
router.get("/explore/:id", getExplore);
router.patch(
  "/explore/:id",
  fileUploader("banners", [
    { name: "icon", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  updateExplore
);
router.delete("/explore/:id", deleteExplore);

//--------------------------------------
//Deals Banner
//--------------------------------------
router.post(
  "/deals-banner",
  fileUploader("dealBanner", [
    { name: "image", maxCount: 1 },
    { name: "bannerImages", maxCount: 5 },
  ]),
  createDealsBanner
);
//------------------------------------------------
// driver
//------------------------------------------------
router.post(
  "/driver/create",
  adminAuthenticate,
  fileUploader("driver", [{ name: "image", maxCount: 1 }]),
  createDriver
);
router.get("/driver/list", adminAuthenticate, getDriver);
router.patch("/driver/block/:driverId", adminAuthenticate, toggleBlockStatus);

//------------------------------------------------
// user
//------------------------------------------------
router.get("/user/list", adminAuthenticate, getAllUsers);

//------------------------------------------------
// coupon
//------------------------------------------------
router.post("/coupon", adminAuthenticate, createCoupon);
router.get("/coupon", adminAuthenticate, getAllCoupons);
router.patch("/coupon/:id", adminAuthenticate, updateCoupon);
router.delete("/coupon/:id", adminAuthenticate, deleteCoupon);

//------------------------------------------------
// order
//------------------------------------------------
router.get("/order/count", adminAuthenticate, getAllOrdersCount);
router.get("/order", adminAuthenticate, getAllOrder);
router.patch("/order/status/:orderId", adminAuthenticate, orderComplete);
// router.post("/order", userAuthenticate, createOrder)
router.get("/order/:orderId", adminAuthenticate, getOrder);
router.get(
  "/order/:orderId/driverlist",
  adminAuthenticate,
  getAllDriverForThisOrder
);
router.patch("/order/assign/:orderId", adminAuthenticate, assignedDriver);

//------------------------------------------------
// invoice
//------------------------------------------------
router.get("/invoice/:orderId", orderInvoice);

//------------------------------------------------
// wallet Request
//------------------------------------------------

// router.post("/wallet/request", adminAuthenticate, createWalletRequest)
router.get("/wallet/request", adminAuthenticate, getWalletRequest);
router.post(
  "/wallet/request/status/:requestId",
  adminAuthenticate,
  changeStatusWalletRequest
);
router.post(
  "/wallet/request/settle/:requestId",
  adminAuthenticate,
  settleRequest
);
// router.post("/vendor/:vendorId/wallet/settle", adminAuthenticate, settleVendorWallet);
router.post(
  "/driver/:driverId/wallet/settle",
  adminAuthenticate,
  settleDriverWallet
);

//------------------------------------------------
// settings
//------------------------------------------------
router.post(
  "/settings/add",
  fileUploader("logo", [{ name: "image", maxCount: 1 }]),
  addSettings
);
router.patch(
  "/settings/update/:id",
  fileUploader("logo", [{ name: "image", maxCount: 1 }]),
  updateSettings
);
router.get("/settings", getSettings);

//------------------------------------------------
// cms
//------------------------------------------------
router.get("/cms", getCms);
router.post("/cms", adminAuthenticate, addCms);
router.patch("/cms/:id", adminAuthenticate, updateCms);

module.exports = router;
