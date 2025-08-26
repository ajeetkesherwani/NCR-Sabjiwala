const express = require("express")
const { createAddress } = require("../controllers/user/addressController/createAddress")
const sendOtp = require("../controllers/user/authController/sendOtp");
const { verifyOtp } = require("../controllers/user/authController/verifyOtp");
const { getProfile } = require("../controllers/user/authController/getProfile");
const { userAuthenticate } = require("../controllers/user/authController/userAuthenticate");
const updateProfile = require("../controllers/user/authController/updateProfile");
const fileUploader = require("../middleware/fileUploader");
const { changeUserType } = require("../controllers/user/authController/chnageUserType");
const { getAllCategory } = require("../controllers/user/homeController/getAllCategory");
const { getAllRecommendedProduct } = require("../controllers/user/homeController/getAllRecommendedProduct");
const { getAllFeaturedProduct } = require("../controllers/user/homeController/getAllFeaturedProduct");
const { getProductOfCategory } = require("../controllers/user/homeController/getProductOfCategory");
const { getShopOfCategory } = require("../controllers/user/homeController/getShopOfCategory");
const { getProductOfShop } = require("../controllers/user/homeController/getProductOfShop");
const { getProductDetail } = require("../controllers/user/homeController/getProductDetail");
const { createCart } = require("../controllers/user/cartController/createCart");
const { getCart } = require("../controllers/user/cartController/getCart");
const createOrder = require("../controllers/user/orderController/createOrder");
const getOrderDetail = require("../controllers/user/orderController/getOrderDetail");
const getAllOrder = require("../controllers/user/orderController/getAllOrder");
const { getAllBanners } = require("../controllers/user/bannerController/getBanner");
const { getCms } = require("../controllers/user/cmsController/getCms");
const { getHomeData } = require("../controllers/user/homeController/getHomeData");
const { getAddress } = require("../controllers/user/addressController/getAddress");
const { getAllToppins } = require("../controllers/user/toppinsController/getToppins");
const updateLatLong = require("../controllers/user/authController/updateLatLong");
const { getExplore } = require("../controllers/user/exploreController/getExploreController");
const { getHomeDataGrocery } = require("../controllers/user/homeController/getHomeDataGrocery");
const { getsubCategoryList } = require("../controllers/user/homeController/getsubCategoryList");
const { getsubCategoryProductList } = require("../controllers/user/homeController/getsubCategoryProductList");
const { getProductDetailOfGrocery } = require("../controllers/user/homeController/getProductDetailOfGrocery");
const { getSpecialGroceryProduct } = require("../controllers/user/homeController/getSpecialGroceryProduct");
const { deleteCart } = require("../controllers/user/cartController/deleteCart");
const { getAllProductOfExploreSection } = require("../controllers/user/exploreController/getAllProductOfExploreSection");
const { getNightCafe } = require("../controllers/user/nightCafeController/getNightCafe");
const { getStore199 } = require("../controllers/user/store199/getStore199");
const { getNightCafeShopOfCategory } = require("../controllers/user/nightCafeController/getNightCafeShopOfCategory");
const { getShopListInNightCafe } = require("../controllers/user/nightCafeController/getShopListInNightCafe");
const sendPushNotification = require("../utils/sendPushNotification");
const getOrderStatus = require("../controllers/user/orderController/orderStatus");
const { getCoupons } = require("../controllers/user/coupon/getCoupon");
const getInvoicePdf = require("../controllers/user/orderController/invoice");
const createRazorpayOrder = require("../controllers/user/paymentController/createRazorpayOrder");
const verifyRazorpayWebhook = require("../controllers/user/paymentController/razorpayWebhook");
const { showDeletePage } = require("../controllers/user/authController/showDeletePage");
const { deleteUser } = require("../controllers/user/authController/deleteUser");
const { getShopList } = require("../controllers/user/homeController/getShopList");
const { createNewCart } = require("../controllers/user/newCartController/createNewCart");
const { getNewCart } = require("../controllers/user/newCartController/getNewCart");
const { updateCartItemQuantity } = require("../controllers/user/newCartController/updateCartItemQuantity");
const { removeFromNewCart } = require("../controllers/user/newCartController/removeFromNewCart");
const { clearNewCart } = require("../controllers/user/newCartController/clearNewCart");
const { changeUserService } = require("../controllers/user/authController/changeUserService");
const { createNewOrder } = require("../controllers/user/newOrderController/createNewOrder");
const { getNewOrder } = require("../controllers/user/newOrderController/getNewOrder");
const { getNewOrderDetails } = require("../controllers/user/newOrderController/getNewOrderDetails");
const { updateAddress } = require("../controllers/user/addressController/updateAddress");
const { deleteAddress } = require("../controllers/user/addressController/deleteAddress");
const { validateNewCartDelivery } = require("../controllers/user/newCartController/validateNewCartDelivery");
const newOrderinvoicePDF = require("../controllers/user/newOrderController/newOrderinvoice");
const { getNewCartTotal } = require("../controllers/user/newCartController/getNewCartTotal");
const { showDeletePage2 } = require("../controllers/user/authController/showDeletePage2");
const { findUser } = require("../controllers/user/authController/findUser");
const { deleteUser2 } = require("../controllers/user/authController/deleteUser2");
const { shopRatingCreate } = require("../controllers/user/ratingController/shopRatingCreate");
const { driverRatingCreate } = require("../controllers/user/ratingController/driverRatingCreate");
const { productRatingCreate } = require("../controllers/user/ratingController/productRatingCreate");
<<<<<<< HEAD
const { getUserSubscriptions } = require("../controllers/user/subscriptionController/getSubscription");
const { createSubscription } = require("../controllers/user/subscriptionController/createSubscription");
const { getSubscriptionById } = require("../controllers/user/subscriptionController/getSubscriptionDetails");
const { updateSubscriptionStatus } = require("../controllers/user/subscriptionController/updateSubscription");
const { walletRecharge } = require("../controllers/user/walletController/walletRecharge");
const { walletHistoryOfUser } = require("../controllers/user/walletController/walletHistoryOfUser");
const { scheduleDeliveries } = require("../../scheduler");
=======
const { getSearch } = require("../controllers/user/homeController/getSearch");
const { walletHistoryOfUser } = require("../controllers/user/walletController/walletHistoryOfUser");
const { getAvailableCoupons } = require("../controllers/user/newCartController/getAvailableCoupons");
const { getCmsForWeb } = require("../controllers/user/cmsController/getCmsForWeb");
>>>>>>> 506cc98bccb177dbb020d33ce27de1504c36e82b
const router = express.Router()

// router.get("/test", (req,res)=>{
//     return res.status(200).json({message : "This is user test route"})
// })

//------------------------------------------------
// auth
//------------------------------------------------
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.get('/profile', userAuthenticate, getProfile);
router.patch('/profile', userAuthenticate, fileUploader("user", [{ name: "image", maxCount: 1 }]), updateProfile);
router.patch('/location', userAuthenticate, updateLatLong);
router.post('/profile/type', userAuthenticate, changeUserType);
router.post('/profile/service', userAuthenticate, changeUserService);


//------------------------------------------------
// Home Food Page
//------------------------------------------------
router.get('/home', userAuthenticate, getHomeData)
router.get('/shop/list', userAuthenticate, getShopList)
router.get('/homegrocery', userAuthenticate, getHomeDataGrocery)
router.get('/category/list', userAuthenticate, getAllCategory);
router.get('/product/list/recommended', userAuthenticate, getAllRecommendedProduct);
router.get('/product/list/featured', userAuthenticate, getAllFeaturedProduct);
router.get('/product/category/:categoryId/list', userAuthenticate, getProductOfCategory);
router.get('/product/:categoryId/shop', userAuthenticate, getShopOfCategory);
router.get('/product/shop/:shopId/list', userAuthenticate, getProductOfShop);
router.get('/product/productdetail/:productId', userAuthenticate, getProductDetail);
router.get('/product/productdetailgrocery/:productId', userAuthenticate, getProductDetailOfGrocery);
router.get("/subCategoryList/:categoryId", userAuthenticate, getsubCategoryList);
router.get("/getsubCategoryProductList/:subCategoryId", userAuthenticate, getsubCategoryProductList);

router.get("/specialGrocery", userAuthenticate, getSpecialGroceryProduct);


//------------------------------------------------
// search
//------------------------------------------------
router.get('/search', userAuthenticate, getSearch);


//------------------------------------------------
// banner
//------------------------------------------------
router.get("/banner/list", userAuthenticate, getAllBanners);


//------------------------------------------------
// explore
//------------------------------------------------
router.get("/explore/:exploreId", userAuthenticate, getExplore);
router.get("/exploreSection/:exploreSectionId", userAuthenticate, getAllProductOfExploreSection);



//------------------------------------------------
// toppins
//------------------------------------------------
router.get("/toppins", getAllToppins);

//------------------------------------------------
// store 199
//------------------------------------------------
router.get("/store199", userAuthenticate, getStore199);

//------------------------------------------------
// night cafe
//------------------------------------------------
router.get("/nightCafe", userAuthenticate, getNightCafe);
router.get('/nightCafe/allshops', userAuthenticate, getShopListInNightCafe);
router.get('/nightCafe/:categoryId/shop', userAuthenticate, getNightCafeShopOfCategory);


//------------------------------------------------
// cart
//------------------------------------------------
router.post("/cart", userAuthenticate, createCart)
router.get("/cart", userAuthenticate, getCart)
router.delete("/cart/:cartItemId", userAuthenticate, deleteCart)

//------------------------------------------------
// new cart
//------------------------------------------------
router.post("/newcart", userAuthenticate, createNewCart)
router.get("/newcart", userAuthenticate, getNewCart)
router.get("/getavailablecoupon", userAuthenticate, getAvailableCoupons)
router.post("/newcart/quantity", userAuthenticate, updateCartItemQuantity)
router.post("/newcart/validate-address", userAuthenticate, validateNewCartDelivery)
router.get("/newcart/total", userAuthenticate, getNewCartTotal);
router.post("/newcart/remove", userAuthenticate, removeFromNewCart)
router.get("/newcart/clear", userAuthenticate, clearNewCart)
// router.delete("/cart/:cartItemId", userAuthenticate, deleteCart)


//------------------------------------------------
// address
//------------------------------------------------
router.get("/address", userAuthenticate, getAddress)
router.post("/address", userAuthenticate, createAddress)
router.patch("/address/:addressId", userAuthenticate, updateAddress)
router.delete("/address/:addressId", userAuthenticate, deleteAddress)


//------------------------------------------------
// order ( not working)
//------------------------------------------------
router.get("/order", userAuthenticate, getAllOrder)
router.post("/order", userAuthenticate, createOrder)
router.get("/order/:orderId", userAuthenticate, getOrderDetail)
router.get("/order/:orderId/status", userAuthenticate, getOrderStatus)


//------------------------------------------------
// new order
//------------------------------------------------
router.post("/neworder", userAuthenticate, createNewOrder)
router.get("/neworder", userAuthenticate, getNewOrder)
router.get("/neworder/:orderId", userAuthenticate, getNewOrderDetails)
// router.post("/newcart/remove", userAuthenticate, removeFromNewCart)
// router.get("/newcart/clear", userAuthenticate, clearNewCart)
// router.delete("/cart/:cartItemId", userAuthenticate, deleteCart)



//------------------------------------------------
// subscription
//------------------------------------------------
router.get('/subscription', userAuthenticate, getUserSubscriptions);
router.post('/subscription', userAuthenticate, createSubscription);
router.get('/subscription/:id', userAuthenticate, getSubscriptionById);
router.patch('/subscription/:id/status', userAuthenticate, updateSubscriptionStatus);




//------------------------------------------------
// payment
//------------------------------------------------
router.post("/wallet/recharge", userAuthenticate, walletRecharge)
router.get("/wallet/history", userAuthenticate, walletHistoryOfUser);
router.post("/create-razorpay-order", createRazorpayOrder);
router.post("/razorpay-webhook", express.raw({ type: 'application/json' }), verifyRazorpayWebhook);



<<<<<<< HEAD
const runSchedulerManually = async (req, res) => {
    console.log('--- MANUAL SCHEDULER TRIGGERED ---');
    await scheduleDeliveries();
    console.log('--- MANUAL SCHEDULER FINISHED ---');
    res.status(200).json({ message: 'Scheduler job executed successfully.' });
};
router.get("/test/cronjob", runSchedulerManually)


=======
//------------------------------------------------
// wallet
//------------------------------------------------
router.get("/wallet/history", userAuthenticate, walletHistoryOfUser);
>>>>>>> 506cc98bccb177dbb020d33ce27de1504c36e82b



//------------------------------------------------
// cms
//------------------------------------------------
router.get("/cms", getCms);
router.get("/cmsforweb", getCmsForWeb);



//------------------------------------------------
// coupon
//------------------------------------------------
router.get("/coupon", userAuthenticate, getCoupons);



//------------------------------------------------
// invoice
//------------------------------------------------
router.get('/invoice/:orderId', newOrderinvoicePDF);
// router.get('/invoice/:orderId', getInvoicePdf);



//------------------------------------------------
// rating
//------------------------------------------------
router.post('/shop/rating', userAuthenticate, shopRatingCreate);
router.post('/driver/rating', userAuthenticate, driverRatingCreate);
router.post('/product/rating', userAuthenticate, productRatingCreate);



//------------------------------------------------
// delete user
//------------------------------------------------
router.get("/delete-user/:id", showDeletePage2);
// router.post("/delete-user/:id", deleteUser);

router.get("/delete-user", showDeletePage2);
router.post("/find-user", findUser);
router.post("/delete-user/:id", deleteUser2);



//------------------------------------------------
// cms
//------------------------------------------------
router.get("/cms", getCms)



//------------------------------------------------
// notification test
//------------------------------------------------
router.post("/notification/send", async (req, res) => {
    const { deviceToken, title, body } = req.body;

    if (!deviceToken || !title || !body) {
        return res.status(400).json({ success: false, message: "Missing fields" });
    }

    try {
        const response = await sendPushNotification({ deviceToken, title, body });
        res.status(200).json({ success: true, message: "Notification sent", response });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to send notification", error: error.message });
    }
});


module.exports = router;