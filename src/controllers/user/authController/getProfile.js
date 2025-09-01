const User = require("../../../models/user");
const catchAsync = require("../../../utils/catchAsync");


exports.getProfile = catchAsync(async (req, res) => {
    try {
        // Use authenticated user ID from middleware
        const userId = req.user._id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        return res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                mobileNo: user.mobileNo,
                email: user.email,
                profileImage: user.profileImage,
                status: user.status,
                createdAt: user.createdAt
            }
        });

    } catch (error) {
        console.error('Error in getProfile controller:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});
