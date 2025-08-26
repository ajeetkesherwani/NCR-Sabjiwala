const Admin = require("../../../models/admin");
const Vendor = require("../../../models/vendor");
const catchAsync = require("../../../utils/catchAsync");
const bcrypt = require('bcrypt');

exports.changePassword = catchAsync(async (req, res, next) => {
    const adminId = req.admin._id;
    const { oldPassword, newPassword } = req.body;

    var hashPassword = await bcrypt.hash(newPassword, 12)
    console.log(hashPassword);

    const admin = await Admin.findById(adminId).select('+password');

    if (!admin || !(await admin.matchPassword(oldPassword))) {
        return res.status(400).json({ status: false, message: 'Current password is incorrect' });
    }

    admin.password = newPassword; // Will be hashed by pre-save middleware
    await admin.save();

    res.status(200).json({ status: true, message: 'Password changed successfully' });
});
