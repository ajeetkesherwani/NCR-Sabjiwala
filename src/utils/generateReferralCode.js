const User = require("../models/user");

const generateReferralCode = async () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const codeLength = 6;

    while (true) {
        let code = '';
        // Generate random code
        for (let i = 0; i < codeLength; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            code += characters[randomIndex];
        }

        // Check if code already exists in database
        const existingUser = await User.findOne({ referralCode: code });

        // If code is unique, return it
        if (!existingUser) {
            return code;
        }
        // If code exists, loop will continue and generate a new code
    }
}

module.exports = generateReferralCode;