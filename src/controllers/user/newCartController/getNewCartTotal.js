const Address = require("../../../models/address");
const newCart = require("../../../models/newCart");
const Setting = require("../../../models/settings");
const getDeliveryCharge = require("../../../utils/getDeliveryCharge");
const User = require("../../../models/user");


exports.getNewCartTotal = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const defaultAddress = await Address.findOne({ userId, isDefault: true });

        var isDefaultAddress = defaultAddress ? true : false;

        let destination;
        if (defaultAddress) {
            destination = {
                lat: defaultAddress.location.coordinates[1],
                long: defaultAddress.location.coordinates[0],
            };
        } else if (user.lat && user.long) {
            destination = {
                lat: Number(user.lat),
                long: Number(user.long),
            };
        } else {
            return res.status(400).json({
                success: false,
                message: "No delivery location found (default address or user location missing)",
            });
        }

        const cartDoc = await newCart.findOne({
            userId,
            status: "active",
            serviceType: user.serviceType,
        }).populate({
            path: "shops.shopId",
            select: "packingCharge lat long name",
        }).populate({
            path: "shops.items.toppings.toppingId",
            select: "price",
        });

        if (!cartDoc || cartDoc.shops.length === 0) {
            return res.status(200).json({
                success: true,
                message: "Cart is empty",
                charges: {
                    platformFee: 0,
                    gst: 0,
                    grandTotal: 0,
                },
                breakdown: {
                    subtotal: 0,
                    totalPackingCharge: 0,
                    totalDeliveryCharge: 0,
                    shops: [],
                },
                isDefaultAddress,
                defaultAddress
            });
        }

        const setting = await Setting.findById("680f1081aeb857eee4d456ab");
        const apiKey = setting?.googleMapApiKey;
        const platformFee = Number(setting?.plateformFee) || 10;

        let subtotal = 0;
        let totalPackingCharge = 0;
        let totalDeliveryCharge = 0;
        const shopBreakdowns = [];

        for (const shop of cartDoc.shops) {
            const shopData = shop.shopId;
            const packingCharge = shopData?.packingCharge || 0;
            totalPackingCharge += packingCharge;

            const origin = {
                lat: shopData?.lat,
                long: shopData?.long,
            };

            const {
                deliveryCharge,
                distanceKm,
                durationText,
            } = await getDeliveryCharge(origin, destination, apiKey);

            totalDeliveryCharge += deliveryCharge;

            let itemTotal = 0;
            for (const item of shop.items) {
                const toppingsTotal = item.toppings.reduce((sum, t) => sum + t.price, 0);
                const itemCost = (item.price + toppingsTotal) * item.quantity;
                itemTotal += itemCost;
            }

            subtotal += itemTotal;

            const shopTotal = itemTotal + packingCharge + deliveryCharge;

            shopBreakdowns.push({
                shopId: shopData._id,
                shopName: shopData.name,
                itemTotal: Number(itemTotal.toFixed(2)),
                packingCharge: Number(packingCharge.toFixed(2)),
                deliveryCharge: Number(deliveryCharge.toFixed(2)),
                distanceKm: Number(distanceKm.toFixed(2)),
                durationText,
                shopTotal: Number(shopTotal.toFixed(2)),
            });
        }

        const gst = 0;
        // const gst = Math.ceil(Number(((subtotal + totalDeliveryCharge) * 0.18).toFixed(2)));
        const grandTotal = subtotal + totalPackingCharge + totalDeliveryCharge + platformFee + gst;

        return res.status(200).json({
            success: true,
            charges: {
                platformFee,
                gst,
                grandTotal: Number(grandTotal.toFixed(2)),
            },
            breakdown: {
                subtotal: Number(subtotal.toFixed(2)),
                totalPackingCharge: Number(totalPackingCharge.toFixed(2)),
                totalDeliveryCharge: Number(totalDeliveryCharge.toFixed(2)),
                shops: shopBreakdowns,
            },
            isDefaultAddress,
            defaultAddress
        });

    } catch (error) {
        console.error("Cart Total Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};


// ------------------------------------------------------------------------------------------------------
// testing
// ------------------------------------------------------------------------------------------------------
// const Address = require("../../../models/address");
// const newCart = require("../../../models/newCart");
// const Setting = require("../../../models/settings");
// const getDeliveryCharge = require("../../../utils/getDeliveryCharge");
// const User = require("../../../models/user");
// const { isWithinRadius } = require("../../../utils/isWithinRadius");

// exports.getNewCartTotal = async (req, res) => {
//     try {
//         const userId = req.user.id;

//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ success: false, message: "User not found" });
//         }

//         const defaultAddress = await Address.findOne({ userId, isDefault: true });

//         const isDefaultAddress = !!defaultAddress;

//         let destination;
//         if (defaultAddress) {
//             destination = {
//                 // lat: defaultAddress.location.coordinates[0],
//                 // long: defaultAddress.location.coordinates[1],
//                 long: defaultAddress.location.coordinates[0],
//                 lat: defaultAddress.location.coordinates[1],
//             };
//         } else if (user.lat && user.long) {
//             destination = {
//                 lat: Number(user.lat),
//                 long: Number(user.long),
//             };
//         } else {
//             return res.status(400).json({
//                 success: false, message: "No delivery location found (default address or user location missing)"
//             });
//         }

//         const cartDoc = await newCart.findOne({ userId, status: "active", serviceType: user.serviceType, }).populate({ path: "shops.shopId", select: "packingCharge lat long name", }).populate({ path: "shops.items.toppings.toppingId", select: "price", });

//         if (!cartDoc || cartDoc.shops.length === 0) {
//             return res.status(200).json({
//                 success: true,
//                 message: "Cart is empty",
//                 charges: {
//                     platformFee: 0,
//                     gst: 0,
//                     grandTotal: 0,
//                 },
//                 breakdown: {
//                     subtotal: 0,
//                     totalPackingCharge: 0,
//                     totalDeliveryCharge: 0,
//                     shops: [],
//                 },
//                 isDefaultAddress,
//                 defaultAddress,
//                 serviceAvailable: false,
//             });
//         }

//         const setting = await Setting.findById("680f1081aeb857eee4d456ab");
//         const apiKey = setting?.googleMapApiKey;
//         const platformFee = Number(setting?.plateformFee) || 10;

//         // Check service availability using isWithinRadius
//         let serviceAvailable = false;
//         let validShops = [];
//         for (const shop of cartDoc.shops) {
//             const shopLoc = {
//                 lat: Number(shop.shopId.lat),
//                 long: Number(shop.shopId.long),
//             };
//             const isNearby = await isWithinRadius(shopLoc, destination, apiKey, 5);
//             if (isNearby) {
//                 serviceAvailable = true;
//                 validShops.push(shop);
//                 // break;
//             }
//         }

//         let subtotal = 0;
//         let totalPackingCharge = 0;
//         let totalDeliveryCharge = 0;
//         const shopBreakdowns = [];

//         for (const shop of cartDoc.shops) {
//             const shopData = shop.shopId;
//             const packingCharge = shopData?.packingCharge || 0;
//             totalPackingCharge += packingCharge;

//             const origin = {
//                 lat: shopData?.lat,
//                 long: shopData?.long,
//             };

//             const {
//                 deliveryCharge,
//                 distanceKm,
//                 durationText,
//             } = await getDeliveryCharge(origin, destination, apiKey);

//             totalDeliveryCharge += deliveryCharge;

//             let itemTotal = 0;
//             for (const item of shop.items) {
//                 const toppingsTotal = item.toppings.reduce((sum, t) => sum + t.price, 0);
//                 const itemCost = (item.price + toppingsTotal) * item.quantity;
//                 itemTotal += itemCost;
//             }

//             subtotal += itemTotal;

//             const shopTotal = itemTotal + packingCharge + deliveryCharge;

//             shopBreakdowns.push({
//                 shopId: shopData._id,
//                 shopName: shopData.name,
//                 itemTotal: Number(itemTotal.toFixed(2)),
//                 packingCharge: Number(packingCharge.toFixed(2)),
//                 deliveryCharge: Number(deliveryCharge.toFixed(2)),
//                 distanceKm: Number(distanceKm.toFixed(2)),
//                 durationText,
//                 shopTotal: Number(shopTotal.toFixed(2)),
//             });
//         }

//         const gst = Math.ceil(Number(((subtotal + totalDeliveryCharge) * 0.18).toFixed(2)));
//         const grandTotal = subtotal + totalPackingCharge + totalDeliveryCharge + platformFee + gst;

//         return res.status(200).json({
//             success: true,
//             charges: {
//                 platformFee,
//                 gst,
//                 grandTotal: Number(grandTotal.toFixed(2)),
//             },
//             breakdown: {
//                 subtotal: Number(subtotal.toFixed(2)),
//                 totalPackingCharge: Number(totalPackingCharge.toFixed(2)),
//                 totalDeliveryCharge: Number(totalDeliveryCharge.toFixed(2)),
//                 shops: shopBreakdowns,
//             },
//             isDefaultAddress,
//             defaultAddress,
//             serviceAvailable,
//             validShops: validShops || []
//         });

//     } catch (error) {
//         console.error("Cart Total Error:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Server error",
//             error: error.message,
//         });
//     }
// };
