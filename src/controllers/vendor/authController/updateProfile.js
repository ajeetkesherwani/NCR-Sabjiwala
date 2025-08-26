const Vendor = require("../../../models/vendor");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const VendorAccount = require("../../../models/vendorAccount");
const ShopSchedule = require("../../../models/shopSchedule");

exports.updateProfile = catchAsync(async (req, res, next) => {
    const {
        user_id, owner_name, shop_name, mobile_no, alternate_phoneNo, email,
        service_id, food_license_no, lat, long, address, bankName,
        accountNo, ifsc, branchName, benificiaryName, schedule, description, type
    } = req.body;

    const vendor = await Vendor.findById(req.vendor._id);
    if (!vendor) return next(new AppError("Vendor not found.", 404));

    // Check for uniqueness only if changed
    if (email && vendor.email !== email) {
        const exists = await Vendor.findOne({ email });
        if (exists) return next(new AppError("Email already in use.", 400));
    }

    if (mobile_no && vendor.mobile_no !== mobile_no) {
        const exists = await Vendor.findOne({ mobile_no });
        if (exists) return next(new AppError("Mobile number already in use.", 400));
    }

    if (user_id && vendor.user_id !== user_id) {
        const exists = await Vendor.findOne({ user_id });
        if (exists) return next(new AppError("User ID already in use.", 400));
    }

    // Optional validation
    if (mobile_no && !/^\d{10}$/.test(mobile_no)) {
        return next(new AppError("Invalid mobile number.", 400));
    }

    if (user_id && !/^[a-z0-9]+$/.test(user_id)) {
        return next(new AppError("User ID must contain only lowercase letters and numbers.", 400));
    }

    // Profile Image
    if (req.files && req.files.profileImage && req.files.profileImage.length > 0) {
        const url = `${req.files.profileImage[0].destination}/${req.files.profileImage[0].filename}`;
        vendor.profileImage = url;
    }

    // Dynamically update only sent fields
    if (user_id) vendor.user_id = user_id.trim().toLowerCase();
    if (owner_name) vendor.owner_name = owner_name;
    if (shop_name) vendor.shop_name = shop_name;
    if (mobile_no) vendor.mobile_no = mobile_no;
    if (alternate_phoneNo) vendor.alternate_phoneNo = alternate_phoneNo;
    if (email) vendor.email = email.toString().trim();
    // if (service_id) vendor.service_id = service_id;
    if (service_id) vendor.service_id = Array.isArray(service_id) ? service_id : [service_id];
    if (food_license_no) vendor.food_license_no = food_license_no;
    if (lat) vendor.lat = lat;
    if (long) vendor.long = long;
    if (address) vendor.address = address;
    if (description) vendor.description = description;
    if (type) vendor.type = type;

    await vendor.save();

    // Vendor Account
    let vendorAccount = await VendorAccount.findOne({ vendorId: vendor._id });
    if (vendorAccount) {
        if (bankName) vendorAccount.bankName = bankName;
        if (accountNo) vendorAccount.accountNo = accountNo;
        if (benificiaryName) vendorAccount.benificiaryName = benificiaryName;
        if (ifsc) vendorAccount.ifsc = ifsc;
        if (branchName) vendorAccount.branchName = branchName;
        await vendorAccount.save();
    }

    // Schedule
    let shopSchedule = await ShopSchedule.findOne({ vendorId: vendor._id });
    if (shopSchedule && schedule) {
        shopSchedule.schedule = schedule;
        await shopSchedule.save();
    }

    return res.status(200).json({
        status: true,
        message: "Vendor profile updated successfully.",
        data: { vendor, vendorAccount, shopSchedule },
    });
});
