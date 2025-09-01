const catchAsync = require("../../../utils/catchAsync");

exports.logout = catchAsync(async (req, res, next) => {
    res.clearCookie("adminToken", {
        httpOnly: true,
        sameSite: "Strict",
        secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({ message: "Logged out" });
})