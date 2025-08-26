const { default: mongoose } = require("mongoose");
const Shop = require("../models/shop");


/**
 * Find nearby shops within a specified radius.
 * @param {Object} coords - User's coordinates { lat, long }
 * @param {String|ObjectId} serviceId - Service ID (string or ObjectId)
 * @param {Number} radiusInKm - Radius in kilometers (default: 20km)
 * @param {Object} extraFilter - Optional additional filters (e.g., { shopType: "veg" })
 * @returns {Promise<Array>} Array of shops within radius
 */

const findNearbyShops = async (coords, serviceId, radiusInKm = 20, extraFilter = {}) => {
    const { lat, long } = coords;

    if (!lat || !long) throw new Error("Invalid coordinates provided");

    const finalServiceId = new mongoose.Types.ObjectId(serviceId);

    const shops = await Shop.find({
        status: "active",
        serviceId: finalServiceId,
        ...extraFilter,
        location: {
            $nearSphere: {
                $geometry: {
                    type: "Point",
                    coordinates: [long, lat],
                },
                $maxDistance: radiusInKm * 1000, // convert km to meters
            },
        },
    });

    return shops;
};

module.exports = findNearbyShops;
