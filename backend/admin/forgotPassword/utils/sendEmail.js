// backend/admin/forgotPassword/utils/sendEmail.js
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../../.env") }); // ensures it finds .env

// 1️⃣ Create OAuth2 client
const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// 2️⃣ Set refresh token
oAuth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

async function sendEmail(to, subject, text) {
  try {
    // 3️⃣ Get access token
    const accessTokenObj = await oAuth2Client.getAccessToken();
    const accessToken = accessTokenObj?.token;

    if (!accessToken) {
      throw new Error("No access token available. Check your refresh token!");
    }

    // 4️⃣ Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.SMTP_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken,
      },
    });

    // 5️⃣ Send email
    const result = await transporter.sendMail({
      from: `CarWash Admin <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
    });

    console.log("✅ Email sent to", to);
    return result;
  } catch (err) {
    console.error("❌ Email sending error:", err.message || err);
    throw err;
  }
}

module.exports = sendEmail;
