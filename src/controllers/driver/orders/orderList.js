// const Driver = require("../../../models/driver");
// const newOrder = require("../../../models/newOrder");
// const order = require("../../../models/order");
// const AppError = require("../../../utils/AppError");
// const catchAsync = require("../../../utils/catchAsync");

// exports.orderList = catchAsync(async (req, res, next) => {
//     try {
//         const driverId = req.driver._id;

//         const type = req.query.type || "all";

//         let filter = { assignedDriver: driverId };

//         if (type == "history") {
//             filter.orderStatus = "delivered";
//         } else if (type == "new") {
//             filter.orderStatus = "shipped";
//         } else if (type == "ongoing") {
//             filter.orderStatus = "running";
//         }

//         const orderListRaw = await newOrder.find(filter).sort({ createdAt: -1 }).populate("shopId", "name address image lat long").populate("addressId", "address1 address2 city pincode state").populate("userId", "name email mobileNo lat long").populate("productData.productId")
//         if (!orderListRaw || orderListRaw.length === 0) {
//             return next(new AppError("No orders found for this driver", 404));
//         }

//         const orderList = orderListRaw.map((ord) => {
//             return {
//                 _id: ord._id,
//                 bookingId: ord.booking_id,
//                 orderId: ord.orderId,
//                 pickup: {
//                     name: ord.shopId.name,
//                     address: ord.shopId.address,
//                     image: ord.shopId.image,
//                     lat: ord.shopId.lat,
//                     long: ord.shopId.long
//                 },
//                 delivery: {
//                     image: ord.userId.profileImage || "",
//                     name: ord.userId.name,
//                     email: ord.userId.email,
//                     mobileNo: ord.userId.mobileNo,
//                     address1: ord.addressId.address1,
//                     address2: ord.addressId.address2,
//                     lat: ord.userId.lat,
//                     long: ord.userId.long,
//                     city: ord.addressId.city,
//                     pincode: ord.addressId.pincode,
//                     state: ord.addressId.state
//                 },
//                 products: ord.productData.map(prod => ({
//                     name: prod.productId?.name || "product name",
//                     price: prod.price,
//                     quantity: prod.quantity,
//                     finalPrice: prod.finalPrice,
//                 })),
//                 // products: {
//                 //     name: ord.productData.product_id.name,
//                 //     price: ord.productData.price,
//                 //     quantity: ord.productData.quantity,
//                 //     finialPrice: ord.productData.finalPrice,
//                 // },
//                 status: ord.orderStatus,
//                 deliveryCharge: ord.deliveryCharge,
//                 totalAmount: ord.finalTotalPrice,
//                 paymentMode: ord.paymentMode,
//                 createdAt: ord.createdAt
//             };
//         })

//         res.status(200).json({
//             success: true,
//             message: "Order list retrieved successfully",
//             count: orderList.length,
//             orderList
//         });
//     } catch (error) {
//         console.error("Error in order list:", error);
//         return next(new AppError("Failed to get order list", 500));
//     }
// });


const Driver = require("../../../models/driver");
const newOrder = require("../../../models/newOrder");
const order = require("../../../models/order");
const Setting = require("../../../models/settings");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const getDistanceAndTime = require("../../../utils/getDistanceAndTime");

exports.orderList = catchAsync(async (req, res, next) => {
    try {
        const driverId = req.driver._id;
        const type = req.query.type || "all";

        let filter = { assignedDriver: driverId };

        if (type === "history") {
            filter.orderStatus = "delivered";
        } else if (type === "new") {
            filter.orderStatus = "shipped";
        } else if (type === "ongoing") {
            filter.orderStatus = "running";
        }

        const orderListRaw = await newOrder
            .find(filter)
            .sort({ createdAt: -1 })
            .populate("shopId", "name address image lat long location phone")
            .populate("addressId", "address1 address2 city pincode state")
            .populate("userId", "name email mobileNo lat long profileImage location")
            .populate("productData.productId");

        if (!orderListRaw || orderListRaw.length === 0) {
            return next(new AppError("No orders found for this driver", 404));
        }

        const settings = await Setting.findOne();
        const googleMapApiKey = settings.googleMapApiKey
        const driverLocation = {
            lat: req.driver.location.coordinates[1],
            long: req.driver.location.coordinates[0],
        };

        const orderList = await Promise.all(
            orderListRaw.map(async (ord) => {
                const shopLocation = {
                    lat: ord.shopId.location.coordinates[1],
                    long: ord.shopId.location.coordinates[0],
                };

                const userLocation = {
                    lat: ord.userId.location.coordinates[1],
                    long: ord.userId.location.coordinates[0],
                };

                const driverToShop = await getDistanceAndTime(driverLocation, shopLocation, googleMapApiKey);
                const shopToUser = await getDistanceAndTime(shopLocation, userLocation, googleMapApiKey);

                const parseKm = (distanceText) => {
                    if (!distanceText || distanceText === "N/A") return 0;
                    return parseFloat(distanceText.replace(",", "").replace(" km", ""));
                };

                const totalKm = parseKm(driverToShop.distance) + parseKm(shopToUser.distance);

                return {
                    _id: ord._id,
                    bookingId: ord.booking_id,
                    orderId: ord.orderId,
                    pickup: {
                        name: ord.shopId.name,
                        address: ord.shopId.address,
                        image: ord.shopId.image,
                        mobileNo: ord.shopId.phone,
                        lat: ord.shopId.lat,
                        long: ord.shopId.long,
                    },
                    delivery: {
                        image: ord.userId.profileImage || "",
                        name: ord.userId.name,
                        email: ord.userId.email,
                        mobileNo: ord.userId.mobileNo,
                        address1: ord.addressId.address1,
                        address2: ord.addressId.address2,
                        lat: ord.userId.lat,
                        long: ord.userId.long,
                        city: ord.addressId.city,
                        pincode: ord.addressId.pincode,
                        state: ord.addressId.state,
                    },
                    products: ord.productData.map((prod) => ({
                        name: prod.productId?.name || "product name",
                        price: prod.price,
                        quantity: prod.quantity,
                        finalPrice: prod.finalPrice,
                    })),
                    status: ord.orderStatus,
                    deliveryCharge: ord.deliveryCharge,
                    totalAmount: ord.finalTotalPrice,
                    paymentMode: ord.paymentMode,
                    createdAt: ord.createdAt,
                    totalKm: Math.ceil(totalKm),
                };
            })
        );

        res.status(200).json({
            success: true,
            message: "Order list retrieved successfully",
            count: orderList.length,
            orderList,
        });
    } catch (error) {
        console.error("Error in order list:", error);
        return next(new AppError("Failed to get order list", 500));
    }
});
