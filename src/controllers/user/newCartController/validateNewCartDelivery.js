const Address = require("../../../models/address");
const newCart = require("../../../models/newCart");
const Setting = require("../../../models/settings");
const User = require("../../../models/user");
const getDistanceAndTime = require("../../../utils/getDistanceAndTime");

exports.validateNewCartDelivery = async (req, res) => {
  try {
    const userId = req.user.id;
    let addresssId;

    if (req.body.addressId) {
      addresssId = await Address.findOne({ _id: req.body.addressId, userId });
    } else {
      addresssId = await Address.findOne({ userId, isDefault: true, status: "active" });
    }

    if (!addresssId || !addresssId.location?.coordinates?.length) {
      return res.status(400).json({ message: "Address not found or has no location" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const cart = await newCart.findOne({ userId, status: "active", serviceType: user.serviceType })
      .populate("shops.shopId");

    if (!cart || cart.shops.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const address = await Address.findOne({ _id: addresssId, userId });
    if (!address || !address.location?.coordinates?.length) {
      return res.status(400).json({ message: "Address not found or has no location" });
    }

    const [addrLong, addrLat] = address.location.coordinates;

    // Get API key from Settings
    const setting = await Setting.findById("680f1081aeb857eee4d456ab");
    const apiKey = setting?.googleMapApiKey || "working";

    const undeliverableShops = [];

    for (const shopGroup of cart.shops) {
      const shop = shopGroup.shopId;
      const shopLat = shop.lat;
      const shopLong = shop.long;

      const { distance } = await getDistanceAndTime(
        { lat: shopLat, long: shopLong },
        { lat: addrLat, long: addrLong },
        apiKey
      );

      const km = parseFloat(distance.replace(" km", ""));
      if (isNaN(km) || km > 5) {
        undeliverableShops.push({ shopId: shop._id, name: shop.name, distance: km || "N/A" });
      }
    }

    if (undeliverableShops.length > 0) {
      return res.status(400).json({
        message: "Some shops do not deliver to this address.",
        undeliverableShops
      });
    }

    return res.status(200).json({ message: "Cart is valid for delivery." });

  } catch (err) {
    console.error("ValidateCart Error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
