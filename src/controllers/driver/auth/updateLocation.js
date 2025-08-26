const Driver = require("../../../models/driver");


const updateDriverLocation = async (req, res) => {
    try {
        const { driverId } = req.params;
        const { latitude, longitude } = req.body;
        console.log(latitude, longitude)

        if (!latitude || !longitude) {
            return res.status(400).json({ success: false, message: "Latitude and Longitude are required" });
        }

        const driver = await Driver.findByIdAndUpdate(
            driverId,
            {
                location: {
                    type: "Point",
                    coordinates: [longitude, latitude]
                }
            },
            { new: true }
        );

        if (!driver) {
            return res.status(404).json({ success: false, message: "Driver not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Location updated successfully",
            location: driver.location
        });
    } catch (error) {
        console.error("Error updating driver location:", error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

module.exports = updateDriverLocation;
