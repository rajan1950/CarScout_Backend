const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");

const escapeHtml = (value = "") => String(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/\"/g, "&quot;")
  .replace(/'/g, "&#39;");

const formatMoney = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return escapeHtml(String(value));
  return `INR ${parsed.toLocaleString("en-IN")}`;
};

const convertTextToHtmlParagraphs = (value = "") => {
  return escapeHtml(String(value))
    .split(/\r?\n/)
    .filter((line) => line.trim() !== "")
    .map((line) => `<p style="margin:0 0 12px 0;font-family:'Segoe UI',Tahoma,Arial,sans-serif;font-size:14px;line-height:1.7;color:#334155;">${line}</p>`)
    .join("");
};

const buildPremiumEmailTemplate = ({ title, subtitle, bodyHtml, bodyText }) => {
  const safeTitle = escapeHtml(title || "CarScout Update");
  const safeSubtitle = escapeHtml(subtitle || "A premium communication from CarScout");
  const contentHtml = bodyHtml || convertTextToHtmlParagraphs(bodyText || "");

  const html = `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>${safeTitle}</title>
    </head>
    <body style="margin:0;padding:0;background:#eef2f7;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#eef2f7;padding:24px 0;">
        <tr>
          <td align="center">
            <table role="presentation" width="680" cellspacing="0" cellpadding="0" border="0" style="width:680px;max-width:92%;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #d9e1ec;">
              <tr>
                <td style="background:linear-gradient(140deg,#0f172a 0%,#1f2937 60%,#374151 100%);padding:30px 36px;color:#ffffff;">
                  <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:12px;letter-spacing:2px;text-transform:uppercase;opacity:.88;">CarScout</p>
                  <h1 style="margin:10px 0 0 0;font-family:Georgia,'Times New Roman',serif;font-size:30px;line-height:1.2;font-weight:700;">${safeTitle}</h1>
                  <p style="margin:10px 0 0 0;font-family:'Segoe UI',Tahoma,Arial,sans-serif;font-size:14px;line-height:1.65;opacity:.93;">${safeSubtitle}</p>
                </td>
              </tr>
              <tr>
                <td style="padding:28px 36px 20px 36px;">
                  ${contentHtml}
                </td>
              </tr>
              <tr>
                <td style="padding:8px 36px 28px 36px;">
                  <p style="margin:0;font-family:'Segoe UI',Tahoma,Arial,sans-serif;font-size:12px;color:#64748b;">This is an automated email from CarScout.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>`;

  const text = bodyText || "CarScout update";
  return { html, text };
};

const buildPurchaseConfirmationTemplate = (data = {}) => {
  const customerName = escapeHtml(data.customerName || data.name || "Customer");
  const orderId = escapeHtml(data.orderId || data.orderNumber || "-");
  const email = escapeHtml(data.email || "-");
  const carName = escapeHtml(data.carName || data.car || "-");
  const totalAmount = formatMoney(data.totalAmount);
  const paymentMethod = escapeHtml(data.paymentMethod || "-");
  const downPayment = formatMoney(data.downPayment);
  const remainingAmount = formatMoney(data.remainingAmount);
  const supportEmail = escapeHtml(data.supportEmail || process.env.EMAIL_FROM || process.env.EMAIL_USER || "support@carscout.com");

  const html = `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Purchase Confirmation</title>
    </head>
    <body style="margin:0;padding:0;background:#f3f5f8;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f3f5f8;padding:24px 0;">
        <tr>
          <td align="center">
            <table role="presentation" width="680" cellspacing="0" cellpadding="0" border="0" style="width:680px;max-width:92%;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #dde3ea;">
              <tr>
                <td style="background:linear-gradient(135deg,#0f172a 0%,#111827 55%,#374151 100%);padding:30px 36px;color:#ffffff;">
                  <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:13px;letter-spacing:2px;text-transform:uppercase;opacity:.85;">CarScout Premium</p>
                  <h1 style="margin:10px 0 0 0;font-family:Georgia,'Times New Roman',serif;font-size:32px;line-height:1.2;font-weight:700;">Purchase Confirmed</h1>
                  <p style="margin:10px 0 0 0;font-family:'Segoe UI',Tahoma,Arial,sans-serif;font-size:14px;line-height:1.6;opacity:.92;">Your order has been secured successfully. Our team will contact you shortly with next-step instructions.</p>
                </td>
              </tr>
              <tr>
                <td style="padding:30px 36px 20px 36px;">
                  <p style="margin:0 0 8px 0;font-family:'Segoe UI',Tahoma,Arial,sans-serif;font-size:15px;color:#334155;">Hello ${customerName},</p>
                  <p style="margin:0;font-family:'Segoe UI',Tahoma,Arial,sans-serif;font-size:14px;line-height:1.7;color:#475569;">Thank you for choosing CarScout. Here are your purchase details:</p>
                </td>
              </tr>
              <tr>
                <td style="padding:0 36px 10px 36px;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;">
                    <tr>
                      <td style="width:38%;padding:12px 14px;background:#f8fafc;font-family:'Segoe UI',Tahoma,Arial,sans-serif;font-size:13px;color:#334155;font-weight:600;border-bottom:1px solid #e2e8f0;">Order ID</td>
                      <td style="padding:12px 14px;background:#ffffff;font-family:'Segoe UI',Tahoma,Arial,sans-serif;font-size:13px;color:#0f172a;border-bottom:1px solid #e2e8f0;">${orderId}</td>
                    </tr>
                    <tr>
                      <td style="padding:12px 14px;background:#f8fafc;font-family:'Segoe UI',Tahoma,Arial,sans-serif;font-size:13px;color:#334155;font-weight:600;border-bottom:1px solid #e2e8f0;">Email</td>
                      <td style="padding:12px 14px;background:#ffffff;font-family:'Segoe UI',Tahoma,Arial,sans-serif;font-size:13px;color:#0f172a;border-bottom:1px solid #e2e8f0;">${email}</td>
                    </tr>
                    <tr>
                      <td style="padding:12px 14px;background:#f8fafc;font-family:'Segoe UI',Tahoma,Arial,sans-serif;font-size:13px;color:#334155;font-weight:600;border-bottom:1px solid #e2e8f0;">Vehicle</td>
                      <td style="padding:12px 14px;background:#ffffff;font-family:'Segoe UI',Tahoma,Arial,sans-serif;font-size:13px;color:#0f172a;border-bottom:1px solid #e2e8f0;">${carName}</td>
                    </tr>
                    <tr>
                      <td style="padding:12px 14px;background:#f8fafc;font-family:'Segoe UI',Tahoma,Arial,sans-serif;font-size:13px;color:#334155;font-weight:600;border-bottom:1px solid #e2e8f0;">Total Amount</td>
                      <td style="padding:12px 14px;background:#ffffff;font-family:'Segoe UI',Tahoma,Arial,sans-serif;font-size:13px;color:#0f172a;border-bottom:1px solid #e2e8f0;">${totalAmount}</td>
                    </tr>
                    <tr>
                      <td style="padding:12px 14px;background:#f8fafc;font-family:'Segoe UI',Tahoma,Arial,sans-serif;font-size:13px;color:#334155;font-weight:600;border-bottom:1px solid #e2e8f0;">Payment Method</td>
                      <td style="padding:12px 14px;background:#ffffff;font-family:'Segoe UI',Tahoma,Arial,sans-serif;font-size:13px;color:#0f172a;border-bottom:1px solid #e2e8f0;">${paymentMethod}</td>
                    </tr>
                    <tr>
                      <td style="padding:12px 14px;background:#f8fafc;font-family:'Segoe UI',Tahoma,Arial,sans-serif;font-size:13px;color:#334155;font-weight:600;border-bottom:1px solid #e2e8f0;">Down Payment</td>
                      <td style="padding:12px 14px;background:#ffffff;font-family:'Segoe UI',Tahoma,Arial,sans-serif;font-size:13px;color:#0f172a;border-bottom:1px solid #e2e8f0;">${downPayment}</td>
                    </tr>
                    <tr>
                      <td style="padding:12px 14px;background:#f8fafc;font-family:'Segoe UI',Tahoma,Arial,sans-serif;font-size:13px;color:#334155;font-weight:700;">Remaining Amount</td>
                      <td style="padding:12px 14px;background:#ffffff;font-family:'Segoe UI',Tahoma,Arial,sans-serif;font-size:14px;color:#0f172a;font-weight:700;">${remainingAmount}</td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:12px 36px 30px 36px;">
                  <p style="margin:0;font-family:'Segoe UI',Tahoma,Arial,sans-serif;font-size:13px;line-height:1.7;color:#475569;">Need help? Reply to this email or contact us at ${supportEmail}.</p>
                </td>
              </tr>
            </table>
            <p style="margin:14px 0 0 0;font-family:'Segoe UI',Tahoma,Arial,sans-serif;font-size:11px;color:#94a3b8;">CarScout, Premium Mobility Marketplace</p>
          </td>
        </tr>
      </table>
    </body>
  </html>`;

  const text = `Purchase Confirmed\n\nHello ${customerName},\nYour purchase request has been confirmed successfully.\n\nOrder ID: ${orderId}\nEmail: ${email}\nVehicle: ${carName}\nTotal Amount: ${totalAmount}\nPayment Method: ${paymentMethod}\nDown Payment: ${downPayment}\nRemaining Amount: ${remainingAmount}\n\nNeed help? Contact: ${supportEmail}`;

  return { html, text };
};

const createTransporter = () => {
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_SECURE || "false") === "true",
      auth: process.env.SMTP_USER
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        : undefined
    });
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const sendEmail = async ({ to, subject, text, html, from }) => {
  const transporter = createTransporter();

  const info = await transporter.sendMail({
    from: from || process.env.EMAIL_FROM || process.env.SMTP_USER || process.env.EMAIL_USER,
    to,
    subject,
    text,
    html
  });

  const provider = process.env.SMTP_HOST ? process.env.SMTP_HOST : "gmail";
  return { info, provider };
};

const sendWelcomeEmail = async (email, name) => {
  const welcomeImagePath = process.env.WELCOME_IMAGE_PATH || path.join(__dirname, "images", "car scout.png");
  const hasWelcomeImage = fs.existsSync(welcomeImagePath);

  const transporter = createTransporter();

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
  const transporter = createTransporter();

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
  buildPremiumEmailTemplate,
  buildPurchaseConfirmationTemplate,
  sendEmail,
  sendWelcomeEmail,
  sendResetPasswordEmail
};