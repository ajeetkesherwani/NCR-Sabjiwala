const Vendor = require("../../../models/vendor");
const catchAsync = require("../../../utils/catchAsync");
const bcrypt = require('bcrypt');

// In vendor controller
exports.changePassword = catchAsync(async (req, res, next) => {
    const vendorId = req.vendor._id;
    const { oldPassword, newPassword } = req.body;

    const vendor = await Vendor.findById(vendorId).select('+password');

    if (!vendor || !(await bcrypt.compare(oldPassword, vendor.password))) {
        return res.status(400).json({ status: false, message: 'Current password is incorrect' });
    }

    var hashPassword = await bcrypt.hash(newPassword, 12)


    vendor.password = hashPassword;
    await vendor.save();

    res.status(200).json({ status: true, message: 'Password changed successfully' });
});
