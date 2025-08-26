const User = require("../../../models/user");

exports.changeUserService = async (req, res) => {
    try {
        const userId = req.user._id;
        const { serviceType } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.serviceType = serviceType || user.serviceType;

        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user
        });

    } catch (error) {
        console.error('Error in updateProfile controller:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};
