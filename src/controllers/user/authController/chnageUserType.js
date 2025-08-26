const User = require("../../../models/user");

exports.changeUserType = async (req, res) => {
    try {
        const userId = req.user._id;
        const { userType } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.userType = userType || user.userType;

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
