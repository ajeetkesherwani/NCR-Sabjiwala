const { axios } = require("axios");
const Address = require("../../../models/address");
const newCart = require("../../../models/newCart");
const Setting = require("../../../models/settings");
const User = require("../../../models/user");
const getDeliveryCharge = require("../../../utils/getDeliveryCharge");

// Main Controller
exports.getNewCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const defaultAddress = await Address.findOne({ userId, isDefault: true });

        let destination;
        if (defaultAddress) {
            destination = {
                lat: defaultAddress.location.coordinates[0],
                long: defaultAddress.location.coordinates[1],
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
    })
      .populate({path: "shops.shopId",select: "name address packingCharge lat long",})
      .populate({path: "shops.vendorId",select: "name",})
      .populate({path: "shops.items.productId",select: "name price primary_image",})
      .populate({path: "shops.items.toppings.toppingId",select: "name price",});

      const setting = await Setting.findById("680f1081aeb857eee4d456ab");
    const apiKey = setting?.googleMapApiKey;
    const plateformFee = Number(setting?.plateformFee) || 10;

    if (!cartDoc || cartDoc.shops.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Cart is empty",
        cart: null,
        platformFee: plateformFee,
      });
    }

    // console.log(typeof(plateformFee), "plateformFee");

    const cart = cartDoc.toObject();
    const platformFee = plateformFee;
    let totalPackingCharge = 0;
    let totalDeliveryCharge = 0;
    let subtotal = 0;

    const shopBreakdown = [];

    cart.shops = await Promise.all(cart.shops.map(async (shop) => {
      const packingCharge = shop.shopId?.packingCharge || 0;

      const origin = {
        lat: shop.shopId?.lat,
        long: shop.shopId?.long,
      };

      // const destination = {
      //   lat: defaultAddress.location.coordinates[0],
      //   long: defaultAddress.location.coordinates[1],
      // };

      const { distanceKm, durationText, deliveryCharge } = await getDeliveryCharge(origin, destination, apiKey);

      let shopItemTotal = 0;

      const updatedItems = shop.items.map(item => {
        const toppingsTotal = item.toppings.reduce((sum, topping) => sum + topping.price, 0);
        const itemTotal = (item.price + toppingsTotal) * item.quantity;
        shopItemTotal += itemTotal;

        return {
          ...item,
          toppings: item.toppings.map(t => ({
            topping_id: t.toppingId?._id,
            name: t.toppingId?.name,
            price: t.price,
          })),
        };
      });

      totalPackingCharge += packingCharge;
      totalDeliveryCharge += deliveryCharge;
      subtotal += shopItemTotal;

      shopBreakdown.push({
        shopId: shop.shopId._id,
        shopName: shop.shopId.name,
        itemTotal: Number(shopItemTotal.toFixed(2)),
        packingCharge: Number(packingCharge.toFixed(2)),
        deliveryCharge: Number(deliveryCharge.toFixed(2)),
        distanceKm,
        durationText,
        shopTotal: Number((shopItemTotal + packingCharge + deliveryCharge).toFixed(2)),
      });

      return {
        ...shop,
        items: updatedItems,
        deliveryInfo: { distanceKm, durationText, deliveryCharge },
      };
    }));

    // const gst = Number(((subtotal + totalPackingCharge + totalDeliveryCharge + platformFee) * 0.18).toFixed(2));
    const gst = Math.ceil((subtotal + totalPackingCharge + totalDeliveryCharge + platformFee) * 0.18);
    const grandTotal = subtotal + totalPackingCharge + totalDeliveryCharge + platformFee + gst;

    return res.status(200).json({
      success: true,
      cart,
      charges: {
        platformFee,
        gst,
        grandTotal: Number(grandTotal.toFixed(2)),
      },
      breakdown: {
        subtotal: Number(subtotal.toFixed(2)),
        totalPackingCharge: Number(totalPackingCharge.toFixed(2)),
        totalDeliveryCharge: Number(totalDeliveryCharge.toFixed(2)),
        shops: shopBreakdown,
      },
    });
  } catch (error) {
    console.error("GetCart Error:", error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};



// exports.getNewCart = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     const cartDoc = await newCart.findOne({
//       userId,
//       status: "active",
//       serviceType: user.serviceType,
//     })
//       .populate({
//         path: "shops.shopId",
//         select: "name address packingCharge lat long",
//       })
//       .populate({
//         path: "shops.vendorId",
//         select: "name",
//       })
//       .populate({
//         path: "shops.items.productId",
//         select: "name price primary_image",
//       })
//       .populate({
//         path: "shops.items.toppings.toppingId",
//         select: "name price",
//       });

//     if (!cartDoc || cartDoc.shops.length === 0) {
//       return res.status(200).json({
//         success: true,
//         message: "Cart is empty",
//         cart: null,
//         platformFee: 10,
//       });
//     }

//     const cart = cartDoc.toObject();

//     const platformFee = 10;
//     let totalPackingCharge = 0;
//     let totalDeliveryCharge = 0;
//     let subtotal = 0;

//     // Transform & enhance cart shops
//     cart.shops = cart.shops.map(shop => {
//       const packingCharge = shop.shopId?.packingCharge || 0;
//       totalPackingCharge += packingCharge;

//       let shopTotal = 0;

//       const updatedItems = shop.items.map(item => {
//         let toppingsTotal = item.toppings.reduce((sum, topping) => sum + topping.price, 0);
//         let itemTotal = (item.price + toppingsTotal) * item.quantity;
//         shopTotal += itemTotal;

//         return {
//           ...item,
//           toppings: item.toppings.map(t => ({
//             topping_id: t.toppingId?._id,
//             name: t.toppingId?.name,
//             price: t.price,
//           })),
//         };
//       });

//       // Example: delivery charge is ₹5 per km (you can replace with real logic)
//       const deliveryCharge = 20; // set fixed or compute dynamically
//       totalDeliveryCharge += deliveryCharge;
//       subtotal += shopTotal;

//       return {
//         ...shop,
//         items: updatedItems,
//         shopName: shop.shopId?.name,
//         packingCharge,
//         deliveryCharge,
//         shopTotal,
//       };
//     });

//     const gst = Number(((subtotal + totalPackingCharge + totalDeliveryCharge + platformFee) * 0.18).toFixed(2));
//     const grandTotal = subtotal + totalPackingCharge + totalDeliveryCharge + platformFee + gst;

//     return res.status(200).json({
//       success: true,
//       cart,
//       charges: {
//         subtotal: Number(subtotal.toFixed(2)),
//         packingCharge: Number(totalPackingCharge.toFixed(2)),
//         deliveryCharge: Number(totalDeliveryCharge.toFixed(2)),
//         platformFee,
//         gst,
//         grandTotal: Number(grandTotal.toFixed(2)),
//       },
//     });
//   } catch (error) {
//     console.error("GetCart Error:", error);
//     return res.status(500).json({ success: false, message: "Server error", error: error.message });
//   }
// };


// ----- Working Code -----
// exports.getNewCart = async (req, res) => {
//     try {
//         const userId = req.user.id;

//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ success: false, message: "User not found" });
//         }

        

//         const cartDoc = await newCart.findOne({ userId, status: "active", serviceType: user.serviceType })
//             .populate({
//                 path: "shops.shopId",
//                 select: "name address packingCharge lat long"
//             })
//             .populate({
//                 path: "shops.vendorId",
//                 select: "name"
//             })
//             .populate({
//                 path: "shops.items.productId",
//                 select: "name price primary_image"
//             })
//             .populate({
//                 path: "shops.items.toppings.toppingId",
//                 select: "name price"
//             });

//         if (!cartDoc || cartDoc.shops.length === 0) {
//             return res.status(200).json({ success: true, message: "Cart is empty", cart: null, platformFee: 10 });
//         }

//         // Convert Mongoose document to plain JS object
//         const cart = cartDoc.toObject();

//         // Transform toppings structure in each item
//         cart.shops = cart.shops.map(shop => ({
//             ...shop,
//             items: shop.items.map(item => ({
//                 ...item,
//                 toppings: item.toppings.map(topping => ({
//                     topping_id: topping.toppingId?._id,
//                     name: topping.toppingId?.name,
//                     price: topping.price
//                 }))
//             }))
//         }));

//         const platformFee = 10;

//         return res.status(200).json({ success: true, cart, platformFee });
//     } catch (error) {
//         console.error("GetCart Error:", error);
//         return res.status(500).json({ success: false, message: "Server error", error: error.message });
//     }
// };
