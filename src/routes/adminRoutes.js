const express = require("express");
const { signup } = require("../controllers/admin/auth/signup");
const { login } = require("../controllers/admin/auth/login");
const { adminAuthenticate } = require("../controllers/admin/auth/adminAuthenticate");
const fileUploader = require("../middleware/fileUploader");
const { createSearchIndex } = require("../models/vendor");
const { createCategory } = require("../controllers/admin/categoryController/createCategory");
const { getVendor } = require("../controllers/admin/vendorController/getVendor");
const { getVendorDetails } = require("../controllers/admin/vendorController/getVendorDetails");
const { vendorBlock } = require("../controllers/admin/vendorController/vendorBlock");
const { vendorApprove } = require("../controllers/admin/vendorController/vendorApprove");
const { getCategory } = require("../controllers/admin/categoryController/getCategory");
const { updateCategoryStatus } = require("../controllers/admin/categoryController/updateCategoryStatus");
const { deleteCategory } = require("../controllers/admin/categoryController/deleteCategory");
const { updateCategory } = require("../controllers/admin/categoryController/updateCategory");
const { getSubCategory } = require("../controllers/admin/categoryController/getSubCategory");
const { getAllSubCategory } = require("../controllers/admin/categoryController/getAllSubCategory");
const { getAllProduct } = require("../controllers/admin/productController/getAllProduct");
const { getVendorProduct } = require("../controllers/admin/vendorController/getVendorProduct");
const { getProductDetail } = require("../controllers/admin/productController/getProductDetail");
const { updateProductStatus } = require("../controllers/admin/productController/updateProductStatus");
const { createProduct } = require("../controllers/admin/productController/createProduct");
const { getAllBrand } = require("../controllers/admin/brandController/getAllBrand");
const { getProductViaService } = require("../controllers/admin/productController/getProductViaService");
const { getSettings } = require("../controllers/admin/settingController/getSettings");
const { addSettings } = require("../controllers/admin/settingController/addSettings");
const { updateSettings } = require("../controllers/admin/settingController/updateSettings");
const { getAllShop } = require("../controllers/admin/vendorController/getAllShop");
const { getAllData } = require("../controllers/admin/dashboardController/getAllData");
const { getShop } = require("../controllers/admin/shopController/getShop");
const { createDriver } = require("../controllers/admin/driverController/createDriver");
const { getDriver } = require("../controllers/admin/driverController/showDriver");
const { deleteShop } = require("../controllers/admin/shopController/deleteShop");
const { deleteVendor } = require("../controllers/admin/vendorController/deleteVendor");
const { getWalletRequest } = require("../controllers/admin/walletController/getWalletRequest");
const { changeStatusWalletRequest } = require("../controllers/admin/walletController/changeStatusWalletRequest");
const { settleRequest } = require("../controllers/admin/walletController/settleRequest");
const getAllOrder = require("../controllers/admin/orderController/getAllOrder");
const { createBanner } = require("../controllers/admin/bannerController/createBanner");
const { getAllBanners } = require("../controllers/admin/bannerController/getBanner");
const { getAllUsers } = require("../controllers/admin/userController/getUser");
const { addCms } = require("../controllers/admin/cmsController/addCms");
const { updateCms } = require("../controllers/admin/cmsController/updateCms");
const { getCms } = require("../controllers/admin/cmsController/getCms");
const { addToppins } = require("../controllers/admin/toppinsController/createToppins");
const { getAllToppins } = require("../controllers/admin/toppinsController/getToppins");
const { updateToppins } = require("../controllers/admin/toppinsController/updateToppins");
const { deleteToppins } = require("../controllers/admin/toppinsController/deleteToppins");
const { createExplore } = require("../controllers/admin/exploreController/createExplore");
const { getAllExplore } = require("../controllers/admin/exploreController/getAllExplore");
const { updateExplore } = require("../controllers/admin/exploreController/updateExplore");
const { getExplore } = require("../controllers/admin/exploreController/getExplore");
const { deleteExplore } = require("../controllers/admin/exploreController/deleteExplore");
const { createExploreSection } = require("../controllers/admin/exploreSectionController/createExploreSection");
const { getAllSections } = require("../controllers/admin/exploreSectionController/getAllExploreSection");
const { getSection } = require("../controllers/admin/exploreSectionController/getExploreSection");
const { updateSection } = require("../controllers/admin/exploreSectionController/updateExploreSection");
const { deleteSection } = require("../controllers/admin/exploreSectionController/deleteExploreSection");
const { orderComplete } = require("../controllers/admin/orderController/orderComplete");
const { createCoupon } = require("../controllers/admin/couponController/createCoupon");
const { getAllCoupons } = require("../controllers/admin/couponController/getAllCoupon");
const { updateCoupon } = require("../controllers/admin/couponController/updateCoupon");
const { deleteCoupon } = require("../controllers/admin/couponController/deleteCoupon");
const { getOrder } = require("../controllers/admin/orderController/getOrder");
const { assignedDriver } = require("../controllers/admin/orderController/assignDriver");
const { getAllProductFlag } = require("../controllers/admin/productFlag/getAllProduct");
const { toggleProductFlag } = require("../controllers/admin/productFlag/toggleProductFlag");
const { deleteProduct } = require("../controllers/admin/productController/deleteProduct");
const { updateProduct } = require("../controllers/admin/productController/updateProduct");
const { getAllProductExplore } = require("../controllers/admin/exploreController/getAllProduct");
const { getExploreViaId } = require("../controllers/admin/exploreSectionController/getExploreViaId");
const { createStore199Product } = require("../controllers/admin/store199Controller/createStore199Product");
const { getAllProductFor199Assign } = require("../controllers/admin/store199Controller/getAllProductFor199Assign");
const { getAllProductOfStore199 } = require("../controllers/admin/store199Controller/getAllProductOfStore199");
const { deleteStore199Product } = require("../controllers/admin/store199Controller/deleteStore199Product");
const { createBulkStore199Product } = require("../controllers/admin/store199Controller/createBulkStore199Product");
const { deleteProductFromExploreSection } = require("../controllers/admin/exploreSectionController/deleteProductFromExploreSection");
const { getAllDriverForThisOrder } = require("../controllers/admin/orderController/getAllDriverForThisOrder");
const { toggleBlockStatus } = require("../controllers/admin/driverController/toggleBlockStatus");
const { assignProductToExploreSection } = require("../controllers/admin/exploreSectionController/assignProductToExploreSection");
const { settleVendorWallet } = require("../controllers/admin/walletController/settleVendorWallet");
const { settleDriverWallet } = require("../controllers/admin/walletController/settleDriverWallert");
const { getAllNewOrder } = require("../controllers/admin/neworderController/getAllNewOrder");
const { getNewOrder } = require("../controllers/admin/neworderController/getNewOrder");
const { getAllDriverForThisNewOrder } = require("../controllers/admin/neworderController/getAllDriverForThisNewOrder");
const { assignNewDriver } = require("../controllers/admin/neworderController/assignNewDriver");
const { createServiceabelAreas } = require("../controllers/admin/serviceableAreasController/createServiceableAreas");
const { getServiceableAreas } = require("../controllers/admin/serviceableAreasController/getServiceableAreas");
const { updateServiceableAreas } = require("../controllers/admin/serviceableAreasController/updateServiceableAreas");
const { deleteServiceableAreas } = require("../controllers/admin/serviceableAreasController/deleteServiceableAreas");
<<<<<<< HEAD
const { deleteBanner } = require("../controllers/admin/bannerController/deleteCategory");
=======
const { deleteBanner } = require("../controllers/admin/bannerController/deleteBanner");
const { shopDetails } = require("../controllers/admin/shopController/shopDetails");
const { driverDetails } = require("../controllers/admin/driverController/driverDetails");
const { toggleVerification } = require("../controllers/admin/driverController/toggleVerification");
const { changePassword } = require("../controllers/admin/auth/changePassword");
const { getShopsByCategory } = require("../controllers/admin/shopController/getShopViaCategory");
const { getTopShops, addTopShop, updateTopShop, deleteTopShop } = require("../controllers/admin/shopController/getTopShops");
const { updateVendorDetails } = require("../controllers/admin/vendorController/updateVendorDetails");
const { payoutList } = require("../controllers/admin/vendorController/payoutList");
const { walletHistoryOfVendor } = require("../controllers/admin/vendorController/walletHistoryOfVendor");
const { walletHistoryOfDriver } = require("../controllers/admin/vendorController/walletHistoryOfDriver");
const { blockUser } = require("../controllers/admin/userController/blockUser");
const { getUserDetails } = require("../controllers/admin/userController/getUserDetails");
const { getSalesChart } = require("../controllers/admin/dashboardController/getSalesChart");
const { getEarningChart } = require("../controllers/admin/dashboardController/getEarningChart");
const { getAverageOrderChart } = require("../controllers/admin/dashboardController/getAverageOrderChart");
const { updateShop } = require("../controllers/admin/shopController/updateShop");
const { settleUserWallet } = require("../controllers/admin/walletController/settleUserWallet");
const { walletHistoryOfUser } = require("../controllers/admin/vendorController/walletHistoryOfUser");

// role-premission
const {
    createPermission,
    getAllPermissions,
    getPermissionById,
    updatePermission,
    deletePermission
} = require('../controllers/admin/rolePremissionController/permissionController');
const { createRole, getAllRoles, getRoleById, updateRole, deleteRole } = require("../controllers/admin/rolePremissionController/roleController");
const { getAllAdmins, createAdmin, getAdminById, updateAdmin, deleteAdmin } = require("../controllers/admin/rolePremissionController/adminController");

>>>>>>> 506cc98bccb177dbb020d33ce27de1504c36e82b
const router = express.Router()

router.get("/test/admin", (req, res) => {
    res.status(200).json({ message: "Admin Route Working" });
})

//------------------------------------------------
// auth
//------------------------------------------------
router.post('/signup', signup)
router.post('/login', login)
router.get("/dashboard", adminAuthenticate, getAllData)
router.get('/dashboard/sales-chart', getSalesChart);
router.get('/dashboard/earnings-chart', getEarningChart);
router.get('/dashboard/average-order-chart', getAverageOrderChart);


//------------------------------------------------
// change password
//------------------------------------------------
router.post("/changePassword", adminAuthenticate, changePassword)



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
router.post("/banner/create", adminAuthenticate, fileUploader("banners", [{ name: "image", maxCount: 1 }]), createBanner);
router.get("/banner/list", adminAuthenticate, getAllBanners);
router.delete("/banner/delete/:id", adminAuthenticate, deleteBanner);


//------------------------------------------------
// category
//------------------------------------------------
router.post('/category/create', adminAuthenticate, fileUploader("category", [{ name: "image", maxCount: 1 }]), createCategory)
router.get('/category/list', adminAuthenticate, getCategory)
router.patch('/category/:id', adminAuthenticate, updateCategoryStatus)
router.patch('/category/update/:id', adminAuthenticate, fileUploader("category", [{ name: "image", maxCount: 1 }]), updateCategory)
router.delete('/category/delete/:id', adminAuthenticate, deleteCategory)

router.get("/subcategory/list", adminAuthenticate, getAllSubCategory)
router.get("/subcategory/:id", adminAuthenticate, getSubCategory)

//------------------------------------------------
// product
//------------------------------------------------
router.post("/product/create", adminAuthenticate, fileUploader("product", [{ name: "primary_image", maxCount: 1 }, { name: "gallery_image", maxCount: 10 }]), createProduct);
router.get("/product/list", adminAuthenticate, getAllProduct)
router.get("/product/list/:id", adminAuthenticate, getProductViaService)
router.get("/product/:id", adminAuthenticate, getProductDetail)
router.patch("/product/:id", fileUploader("product", [{ name: "primary_image", maxCount: 1 }, { name: "gallery_image", maxCount: 10 }]), updateProduct);
router.patch('/product/:id/toggle-status', updateProductStatus);
router.delete("/product/:id", adminAuthenticate, deleteProduct);


//------------------------------------------------
// product flag
//------------------------------------------------
router.get("/product/flag/list", adminAuthenticate, getAllProductFlag)
router.post("/product/flag/toggle", adminAuthenticate, toggleProductFlag)


//------------------------------------------------
// brand
//------------------------------------------------
router.get("/brand/list", adminAuthenticate, getAllBrand)


//------------------------------------------------
// toppins
//------------------------------------------------
router.post("/toppins", addToppins);
router.get("/toppins", getAllToppins);
router.patch("/toppins/:id", updateToppins);
router.delete("/toppins/:id", deleteToppins);


//------------------------------------------------
// explore
//------------------------------------------------
router.post("/explore", fileUploader("banners", [{ name: "icon", maxCount: 1 }, { name: "banner", maxCount: 1 },]), createExplore);
router.get("/explore", getAllExplore);
router.get("/explore/:id", getExplore);
router.patch("/explore/:id", fileUploader("banners", [{ name: "icon", maxCount: 1 }, { name: "banner", maxCount: 1 },]), updateExplore);
router.delete("/explore/:id", deleteExplore);


//------------------------------------------------
// explore section
//------------------------------------------------
router.post("/exploresection", createExploreSection);
router.get("/exploresection", getAllSections);
router.get("/exploresection/products", getAllProductExplore);
router.get("/exploresection/:id", getSection);
router.get("/explore/:exploreId/section", getExploreViaId);
router.patch("/exploresection/:id", updateSection);
router.delete("/exploresection/:id", deleteSection);
router.post("/exploresection/product", deleteProductFromExploreSection);
router.post("/exploresection/assign/product", assignProductToExploreSection);

//------------------------------------------------
// store199 product
//------------------------------------------------
router.post("/store199/product", adminAuthenticate, createStore199Product)
router.get("/store199/product", adminAuthenticate, getAllProductOfStore199)
router.delete("/store199/product/:id", adminAuthenticate, deleteStore199Product)
router.get("/store199/product/all", adminAuthenticate, getAllProductFor199Assign)
router.post("/store199/product/bulk", adminAuthenticate, createBulkStore199Product)
// router.get("/copy/product/:id", vendorAuthenticate, getCopyProductDetail)
// router.patch("/copy/product/status/:id", vendorAuthenticate, updateCopyProductStatus)
// router.patch("/copy/product/update/:id", vendorAuthenticate, updateCopyProduct)


//------------------------------------------------
// vendor
//------------------------------------------------
router.get("/vendor/list", adminAuthenticate, getVendor)
router.get("/vendor/:id", adminAuthenticate, getVendorDetails)
router.patch(
    "/vendor/:id",
    adminAuthenticate,
    fileUploader("vendor", [
        { name: "profileImg", maxCount: 1 },
        { name: "panImage", maxCount: 1 },
        { name: "gstImage", maxCount: 1 },
        { name: "foodImage", maxCount: 1 },
        { name: "passbook", maxCount: 1 }
    ]),
    updateVendorDetails
)
router.patch("/vendor/block/:id", adminAuthenticate, vendorBlock)
router.patch("/vendor/approve/:id", adminAuthenticate, vendorApprove);
router.delete("/vendor/delete/:id", adminAuthenticate, deleteVendor);
router.get("/vendor/:id/product", adminAuthenticate, getVendorProduct)
router.get("/vendor/shop/list/:vendorId", adminAuthenticate, getAllShop)


//------------------------------------------------
// shop
//------------------------------------------------
router.get("/shop/list", adminAuthenticate, getShop)
router.get("/shop/listviacategory/:categoryId", adminAuthenticate, getShopsByCategory)
router.get("/shop/details/:shopId", adminAuthenticate, shopDetails)
router.patch("/shop/update/:shopId", adminAuthenticate, updateShop)
router.delete("/shop/delete/:shopId", adminAuthenticate, deleteShop)


//------------------------------------------------
// shop
//------------------------------------------------
router.get("/topshop/:categoryId", adminAuthenticate, getTopShops)
router.post("/topshop", adminAuthenticate, addTopShop)
router.patch("/topshop", adminAuthenticate, updateTopShop)
router.post("/topshop/delete", adminAuthenticate, deleteTopShop)



//------------------------------------------------
// driver
//------------------------------------------------
router.post("/driver/create", adminAuthenticate, fileUploader("driver", [{ name: "image", maxCount: 1 }]), createDriver);
router.get('/driver/list', adminAuthenticate, getDriver)
router.get('/driver/details/:driverId', adminAuthenticate, driverDetails);
router.patch("/driver/verify/:driverId", adminAuthenticate, toggleVerification);
router.patch("/driver/block/:driverId", adminAuthenticate, toggleBlockStatus);


//------------------------------------------------
// user
//------------------------------------------------
router.get("/user/list", adminAuthenticate, getAllUsers)
router.get("/user/:userId", adminAuthenticate, getUserDetails)
router.patch("/user/:userId/block", adminAuthenticate, blockUser)


//------------------------------------------------
// coupon
//------------------------------------------------
router.post("/coupon", adminAuthenticate, createCoupon)
router.get("/coupon", adminAuthenticate, getAllCoupons);
router.patch("/coupon/:id", adminAuthenticate, updateCoupon);
router.delete("/coupon/:id", adminAuthenticate, deleteCoupon);



//------------------------------------------------
// order
//------------------------------------------------
router.get("/order", adminAuthenticate, getAllOrder)
router.patch("/order/status/:orderId", adminAuthenticate, orderComplete)
// router.post("/order", userAuthenticate, createOrder)
router.get("/order/:orderId", adminAuthenticate, getOrder)
router.get("/order/:orderId/driverlist", adminAuthenticate, getAllDriverForThisOrder)

router.patch("/order/assign/:orderId", adminAuthenticate, assignedDriver)


//------------------------------------------------
// new order
//------------------------------------------------
router.get("/neworder", adminAuthenticate, getAllNewOrder)
// router.patch("/neworder/status/:orderId", adminAuthenticate, orderComplete)
router.get("/neworder/:orderId", adminAuthenticate, getNewOrder)
router.get("/neworder/:orderId/driverlist", adminAuthenticate, getAllDriverForThisNewOrder)

router.patch("/neworder/assign/:orderId", adminAuthenticate, assignNewDriver)



//------------------------------------------------
// wallet
//------------------------------------------------

// router.get("/wallet", vendorAuthenticate, getVendorWallet)
// router.get("/shops/wallets", vendorAuthenticate, getAllShopWallet)
// router.get("/shop/:shopId/wallet/history", vendorAuthenticate, getShopWalletHistory);
// router.get("/wallet/history", vendorAuthenticate, getVendorWalletHistory)
// router.post("/admin/vendor/:vendorId/wallet/settle", adminAuthenticate, settleVendorWallet); this is for admin
// router.get("/wallet/settlements", vendorAuthenticate, getVendorWalletSettlements);
router.get("/payout", adminAuthenticate, payoutList)


//------------------------------------------------
// wallet Request
//------------------------------------------------

// router.post("/wallet/request", adminAuthenticate, createWalletRequest)
router.get("/wallet/request", adminAuthenticate, getWalletRequest)
router.post("/wallet/request/status/:requestId", adminAuthenticate, changeStatusWalletRequest)
router.post("/wallet/request/settle/:requestId", adminAuthenticate, settleRequest);
// vendor wallet
router.post("/vendor/:vendorId/wallet/settle", adminAuthenticate, settleVendorWallet);
router.get("/vendor/:vendorId/settlement/history", adminAuthenticate, walletHistoryOfVendor);
// driver wallet
router.post("/driver/:driverId/wallet/settle", adminAuthenticate, settleDriverWallet);
router.get("/driver/:driverId/settlement/history", adminAuthenticate, walletHistoryOfDriver);
// user wallet
router.post("/user/:userId/wallet/settle", adminAuthenticate, settleUserWallet);
router.get("/user/:userId/settlement/history", adminAuthenticate, walletHistoryOfUser);


//------------------------------------------------
// settings
//------------------------------------------------
router.post("/settings/add", fileUploader("logo", [{ name: "image", maxCount: 1 }]), addSettings)
router.patch("/settings/update/:id", fileUploader("logo", [{ name: "image", maxCount: 1 }]), updateSettings)
router.get("/settings", getSettings)



//------------------------------------------------
// Role and Premission
//------------------------------------------------
router.get("/premission", adminAuthenticate, getAllPermissions)
router.post("/premission", adminAuthenticate, createPermission)
router.get("/premission/:id", adminAuthenticate, getPermissionById)
router.patch("/premission/:id", adminAuthenticate, updatePermission)
router.delete("/premission/:id", adminAuthenticate, deletePermission)

router.get("/role", adminAuthenticate, getAllRoles)
router.post("/role", adminAuthenticate, createRole)
router.get("/role/:id", adminAuthenticate, getRoleById)
router.patch("/role/:id", adminAuthenticate, updateRole)
router.delete("/role/:id", adminAuthenticate, deleteRole)

router.get("/getadmin", adminAuthenticate, getAllAdmins)
router.post("/createadmin", adminAuthenticate, createAdmin)
router.get("/getadmin/:id", adminAuthenticate, getAdminById)
router.patch("/updateadmin/:id", adminAuthenticate, updateAdmin)
router.delete("/deleteadmin/:id", adminAuthenticate, deleteAdmin)




//------------------------------------------------
// cms
//------------------------------------------------
router.get("/cms", getCms)
router.post("/cms", adminAuthenticate, addCms)
router.patch("/cms/:id", adminAuthenticate, updateCms)



module.exports = router;