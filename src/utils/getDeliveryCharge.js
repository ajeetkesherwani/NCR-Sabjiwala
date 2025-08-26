const axios = require("axios");

const deliveryPriceInfo = [
    { range: "0-5", price: 5 },
    { range: "5-10", price: 7 },
    { range: "10-20", price: 9 },
    { range: "20-2000", price: 10 }
];


const getDeliveryCharge = async (origin, destination, apiKey) => {
    try {
        // Validate coordinates
        if (!origin?.lat || !origin?.long || !destination?.lat || !destination?.long) {
            console.error('Invalid coordinates:', { origin, destination });
            throw new Error('Invalid coordinates provided');
        }

        // Parse coordinates to ensure they're numbers
        const originLat = parseFloat(origin.lat);
        const originLong = parseFloat(origin.long);
        const destLat = parseFloat(destination.lat);
        const destLong = parseFloat(destination.long);

        if (isNaN(originLat) || isNaN(originLong) || isNaN(destLat) || isNaN(destLong)) {
            console.error('Coordinates are not valid numbers:', { origin, destination });
            throw new Error('Coordinates must be valid numbers');
        }

        const url = "https://maps.googleapis.com/maps/api/distancematrix/json";
        const params = {
            origins: `${originLat},${originLong}`,
            destinations: `${destLat},${destLong}`,
            key: apiKey,
        };

        console.log('Making distance matrix request with params:', params);

        const response = await axios.get(url, { params });
        const data = response.data;

        if (data.status === "OK" && data.rows[0].elements[0].status === "OK") {
            const element = data.rows[0].elements[0];
            const distanceMeters = element.distance.value;
            const distanceKm = Math.ceil(distanceMeters / 1000);
            const durationText = element.duration.text;

            let deliveryCharge = 10;

            return {
                distanceKm,
                durationText,
                deliveryCharge: Math.ceil(distanceKm * deliveryCharge)
            };
        } else {
            return {
                distanceKm: 0,
                durationText: "N/A",
                deliveryCharge: 10
            };
        }
    } catch (err) {
        console.error("Delivery charge calculation error:", {
            error: err.message,
            origin,
            destination,
            stack: err.stack
        });
        
        // Throw error instead of returning default values
        throw new Error(`Failed to calculate delivery charge: ${err.message}`);
    }
};

module.exports = getDeliveryCharge;
