const User = require("../../../models/user");
const catchAsync = require("../../../utils/catchAsync");

function generateReferralCode() {
    const prefix = "NCRSW";
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    return `${prefix}${randomNum}`;
}

exports.createUser = catchAsync(async (req, res) => {
    try {
        const { mobileNo, email, name } = req.body;

         if (req.files && req.files.profileImage && req.files.profileImage[0]) {
           profileImage = req.files.profileImage[0].path;
    }

        if (!mobileNo && !email) {
            return res.status(400).json({ success: false, message: "Mobile number or email required" });
        }

        let user = await User.findOne({ $or: [{ mobileNo }, { email }] });

        if (!user) {
            user = await User.create({
                name,
                mobileNo,
                email,
                profileImage,
                referralCode: generateReferralCode()
            });
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
                referralCode: user.referralCode,
                createdAt: user.createdAt
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});