const Product = require("../../../models/product");
const ShopSchedule = require("../../../models/shopSchedule");
const Vendor = require("../../../models/vendor");
const catchAsync = require("../../../utils/catchAsync");

exports.updateVendorDetails = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const vendor = await Vendor.findById(id);
    if (!vendor) return res.status(404).json({ status: false, message: "Vendor not found" });

    // Helper to check if value is not undefined or 'undefined'
    const isValid = v => v !== undefined && v !== null && v !== 'undefined';

    const { name, mobile, alternateMobile, email, panNo, gstNo, foodLicense, commission, payoutType } = req.body;
    if (isValid(name)) vendor.name = name;
    if (isValid(mobile)) vendor.mobile = mobile;
    if (isValid(alternateMobile)) vendor.alternateMobile = alternateMobile;
    if (isValid(email)) vendor.email = email;
    if (isValid(panNo)) vendor.panNo = panNo;
    if (isValid(gstNo)) vendor.gstNo = gstNo;
    if (isValid(foodLicense)) vendor.foodLicense = foodLicense;
    if (isValid(commission)) vendor.commission = commission;
    if (isValid(payoutType)) vendor.payoutType = payoutType;
    if (req.files && req.files.panImage) vendor.panImage = req.files.panImage[0].path;
    if (req.files && req.files.gstImage) vendor.gstImage = req.files.gstImage[0].path;
    if (req.files && req.files.foodImage) vendor.foodImage = req.files.foodImage[0].path;

    await vendor.save();


    // Update bank details directly in vendor model
    const { accountNo, bankName, branchName, ifsc, benificiaryName } = req.body;
    if (isValid(accountNo)) vendor.accountNo = accountNo;
    if (isValid(bankName)) vendor.bankName = bankName;
    if (isValid(branchName)) vendor.branchName = branchName;
    if (isValid(ifsc)) vendor.ifsc = ifsc;
    if (isValid(benificiaryName)) vendor.benificiaryName = benificiaryName;
    if (req.files && req.files.passbook) vendor.passbook = req.files.passbook[0].path;
    await vendor.save();

    // Update or create shop schedule
    let shopTime = await ShopSchedule.findOne({ vendorId: vendor._id });
    const { openTime, closeTime, days } = req.body;
    if (openTime || closeTime || days) {
        if (!shopTime) {
            shopTime = new ShopSchedule({ vendorId: vendor._id });
        }
        if (openTime) shopTime.openTime = openTime;
        if (closeTime) shopTime.closeTime = closeTime;
        if (days) shopTime.days = days;
        await shopTime.save();
    }

    // Product count
    const productCount = await Product.countDocuments({ vendorId: vendor._id });
    const vendorObj = vendor.toObject();
    vendorObj.productCount = productCount;

    return res.status(200).json({
        status: true,
        message: "Vendor details updated successfully",
        data: { vendor: vendorObj}
    });
});