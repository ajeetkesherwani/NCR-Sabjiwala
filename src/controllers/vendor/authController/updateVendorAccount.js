const Vendor = require("../../../models/vendor");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.updateVendorAccount = catchAsync(async (req, res, next) => {
    try {
        const vendorId = req.vendor._id;

        const { accountNo, bankName, branchName, ifsc, benificiaryName } = req.body;
        if (accountNo.trim() == 'undefined') accountNo = ""
        if (bankName.trim() == 'undefined') bankName = ""
        if (branchName.trim() == 'undefined') branchName = ""
        if (ifsc.trim() == 'undefined') ifsc = ""

        const vendor = await Vendor.findById(vendorId);
        if (!vendor) return next(new AppError("Vendor not found.", 404));

        vendor.accountNo = accountNo || vendor.accountNo
        vendor.bankName = bankName || vendor.bankName
        vendor.branchName = branchName || vendor.branchName
        vendor.benificiaryName = benificiaryName || vendor.benificiaryName
        vendor.ifsc = ifsc || vendor.ifsc
        if (req.files.passbook) {
            vendor.passbook = req.files.passbook[0].path
        }
        await vendor.save();

        return res.status(200).json({
            status: true,
            message: "Bank updated successfully"
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
