const User = require("../../../models/user");

const updateLatLong = async (req, res) => {
    try {
        const userId = req.user._id;
        const { lat, long } = req.body;

        if (!lat || !long) {
            return res.status(400).json({ success: false, message: 'Latitude and Longitude are required' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        user.lat = lat;
        user.long = long;
        user.location = {
            type: 'Point',
            coordinates: [parseFloat(long), parseFloat(lat)]
        };
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Location updated successfully',
            user
        });

    } catch (error) {
        console.error('Error in updateLatLong controller:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

module.exports = updateLatLong;
