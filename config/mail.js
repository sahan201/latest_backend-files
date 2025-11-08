import nodemailer from "nodemailer";

// Create transporter with Gmail configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false, // Use false for port 587 (STARTTLS)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Verify transporter configuration on startup
transporter.verify(function (error, success) {
  if (error) {
    console.log("❌ Email configuration error:", error.message);
    console.log("⚠️  Email functionality will not work. Using mock emails.");
  } else {
    console.log("✅ Email server is ready to send messages");
    console.log("📧 Sending from:", process.env.EMAIL_USER);
  }
});

export default transporter;
