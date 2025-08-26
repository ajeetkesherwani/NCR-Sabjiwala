// utils/getDistanceAndTime.js
const axios = require("axios");

const getDistanceAndTime = async (origin, destination, apiKey) => {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json`;
    const params = {
        origins: `${origin.lat},${origin.long}`,
        destinations: `${destination.lat},${destination.long}`,
        key: apiKey,
    };


    try {
        const response = await axios.get(url, { params });
        const data = response.data;

        if (data.status === "OK" && data.rows[0].elements[0].status === "OK") {
            const element = data.rows[0].elements[0];
            return {
                distance: element.distance.text,  // e.g., "2.3 km"
                time: element.duration.text       // e.g., "5 mins"
            };
        } else {
            return { distance: "N/A", time: "N/A" };
        }
    } catch (error) {
        console.error("Google Maps API Error:", error.message);
        return { distance: "N/A", time: "N/A" };
    }
};

module.exports = getDistanceAndTime;
