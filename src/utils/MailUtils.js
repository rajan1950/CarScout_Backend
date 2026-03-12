const nodemailer = require("nodemailer");

const sendWelcomeEmail = async (email, name) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from:process.env.EMAIL_USER,
    to: email,
    subject: "Welcome to CarScout",
    text: `Hello ${name}, welcome to CarScout 🚗`,
    attachments: [
      {
        filename: "welcome-image.jpg",
        path: __dirname + "/CarScout.png"
      }
    ]

  };

  await transporter.sendMail(mailOptions);
  console.log(`Welcome email sent to ${email}`);
};

module.exports = {
  sendWelcomeEmail
};