const admin = require("../firebase/firebase");

const sendPushNotification = async ({ deviceToken, title, body, data = {} }) => {
    if (!deviceToken) return;

    const message = {
        token: deviceToken,
        notification: {
            title,
            body
        },
        data: {
            ...data,
            click_action: "FLUTTER_NOTIFICATION_CLICK" 
        }
    };

    try {
        const response = await admin.messaging().send(message);
        console.log("✅ Notification sent:", response);
        return response;
    } catch (error) {
        console.error("❌ Error sending notification:", error);
        throw error;
    }
};

module.exports = sendPushNotification;
