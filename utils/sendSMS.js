// utils/sendSMS.js
require("dotenv").config();

async function sendSMS(to, message) {
  const twilio = await import("twilio"); // dynamic import for ESM-only support
  const client = twilio.default(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  try {
    const response = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER, // your Twilio number
      to: to, // recipient's number
    });

    console.log("✅ SMS sent successfully:", response.sid);
    return response;
  } catch (error) {
    console.error("❌ Failed to send SMS:", error.message);
    throw error;
  }
}

module.exports = sendSMS;

// const sendSMS = require("./utils/sendSMS");

// (async () => {
//   try {
//     const response = await sendSMS("+916309889964", "Hello from MERN app 👋");
//     console.log("SMS sent:", response);
//   } catch (err) {
//     console.log("Error sending SMS:", err.message);
//   }
// })();
