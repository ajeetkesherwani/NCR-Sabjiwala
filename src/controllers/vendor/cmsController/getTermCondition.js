const Setting = require("../../../models/settings");
const catchAsync = require("../../../utils/catchAsync");

exports.getTermCondition = catchAsync(async (req, res) => {
    // const data = `
    //     <h2>Terms & Conditions</h2>
    //     <p>Welcome to Go Rabbit! By accessing or using our services, you agree to be bound by these terms and conditions.</p>

    //     <h3>1. Use of Service</h3>
    //     <p>You agree to use the platform for lawful purposes only and comply with all applicable laws and regulations.</p>

    //     <h3>2. Vendor Responsibilities</h3>
    //     <p>Vendors must provide accurate shop and product information, maintain stock updates, and fulfill orders promptly.</p>

    //     <h3>3. User Data</h3>
    //     <p>We respect your privacy. Your data will be handled in accordance with our Privacy Policy.</p>

    //     <h3>4. Modifications</h3>
    //     <p>We may revise these terms at any time without prior notice. Continued use of the platform constitutes acceptance of the changes.</p>

    //     <h3>5. Contact</h3>
    //     <p>For any questions, please contact support@gorabbit.com.</p>
    // `;

    let data = "";
    const setting = await Setting.findOne();
    data = setting.termAndConditions;

    return res.status(200).json({
        success: true,
        message: "Terms & Conditions fetched successfully.",
        data: data,
    });
});
