const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");

const sendWelcomeEmail = async (email, name) => {
  const welcomeImagePath = process.env.WELCOME_IMAGE_PATH || path.join(__dirname, "images", "car scout.png");
  const hasWelcomeImage = fs.existsSync(welcomeImagePath);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Welcome to CarScout",
    html: `
      <div style="background:#1e1e1e;padding:40px;text-align:center;font-family:Arial;color:white">

        <h1>Welcome to <span style="color:red">CarScout 🚗</span></h1>

        <p>Hello <b>${name}</b></p>

        <p>Thank you for joining CarScout.</p>

        <p>Your smart platform to buy and sell cars easily.</p>

        <a href="http://localhost:5173/login"
        style="background:red;color:white;padding:12px 25px;border-radius:5px;text-decoration:none">
        Login to Your Account
        </a>

        <p style="margin-top:20px;font-size:12px">
        © 2026 CarScout
        </p>

      </div>
    `,
    attachments: hasWelcomeImage
      ? [
          {
            filename: path.basename(welcomeImagePath),
            path: welcomeImagePath
          }
        ]
      : [],
    
  };

  await transporter.sendMail(mailOptions);

};

const sendResetPasswordEmail = async (email, resetUrl) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset Password Link",
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#222">
        <p>You requested a password reset for your CarScout account.</p>
        <p>
          <a href="${resetUrl}" style="display:inline-block;background:#d62828;color:#fff;padding:10px 16px;text-decoration:none;border-radius:4px">
            Reset Password
          </a>
        </p>
        <p>This link expires in 15 minutes.</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendWelcomeEmail,
  sendResetPasswordEmail
};