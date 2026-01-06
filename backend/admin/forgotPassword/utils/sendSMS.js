const axios = require("axios");

const sendSMS = async (phone, message) => {
  try {
    const formattedPhone = phone.startsWith("+") ? phone : "+91" + phone;

    const response = await axios.get("https://api.msg91.com/api/sendhttp.php", {
      params: {
        authkey: process.env.SMS_AUTH_KEY,
        mobiles: formattedPhone,
        message: message,
        sender: process.env.SMS_SENDER,
        route: process.env.SMS_ROUTE,
        country: process.env.SMS_COUNTRY,
      },
    });

    console.log("SMS sent successfully:", response.data);
    return response.data;
  } catch (err) {
    console.error("SMS send error:", err.response?.data || err.message);
    throw new Error("Failed to send SMS");
  }
};

module.exports = sendSMS;
