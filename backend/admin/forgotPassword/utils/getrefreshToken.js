const { google } = require("googleapis");
const readline = require("readline");
require("dotenv").config();


// 1️⃣ OAuth2 client
const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// 2️⃣ Gmail send scope
const SCOPES = ["https://www.googleapis.com/auth/gmail.send"];

// 3️⃣ Generate URL
const authUrl = oAuth2Client.generateAuthUrl({
  access_type: "offline", // important to get refresh token
  scope: SCOPES,
  prompt: "consent",      // force consent screen
});

console.log("🔗 Authorize this app by visiting this URL:\n");
console.log(authUrl);

// 4️⃣ Prompt for code
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("\nEnter the code from that page here: ", async (code) => {
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    console.log("\n✅ Success! Copy this refresh token into your .env:\n");
    console.log(tokens.refresh_token);
    rl.close();
  } catch (err) {
    console.error("❌ Error getting tokens:", err);
  }
});
