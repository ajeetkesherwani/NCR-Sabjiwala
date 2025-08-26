const axios = require('axios');

const sendSmsOtp = async (mobile, otp) => {
    try {
        const response = await axios.get(`https://commnestsms.com/api/push.json?apikey=6766c9b4dad25&route=transactional&sender=BGGIES&mobileno=${mobile}&text=${otp}%20%20is%20your%20authentication%20code%20at%20BiggiesPizza`);
        console.log('OTP sent:', response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to send OTP:', error.response?.data || error.message);
        throw error;
    }
};

module.exports = sendSmsOtp;