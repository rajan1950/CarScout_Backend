const {
  sendEmail,
  buildPurchaseConfirmationTemplate,
  buildPremiumEmailTemplate
} = require("../utils/MailUtils");

const sendMail = async (req, res) => {
  try {
    const {
      to,
      email,
      subject,
      text,
      html,
      from,
      template,
      templateData = {},
      subtitle,
      useRawHtml
    } = req.body;
    const recipient = to || email;
    let finalSubject = subject;
    let finalText = text;
    let finalHtml = html;

    if (template === "purchaseConfirmation") {
      const mergedTemplateData = {
        ...templateData,
        customerName: templateData.customerName || req.body.customerName || req.body.name,
        orderId: templateData.orderId || req.body.orderId || req.body.orderNumber,
        email: templateData.email || recipient,
        carName: templateData.carName || req.body.carName || req.body.car,
        totalAmount: templateData.totalAmount || req.body.totalAmount,
        paymentMethod: templateData.paymentMethod || req.body.paymentMethod,
        downPayment: templateData.downPayment || req.body.downPayment,
        remainingAmount: templateData.remainingAmount || req.body.remainingAmount
      };

      const templateContent = buildPurchaseConfirmationTemplate(mergedTemplateData);
      finalHtml = templateContent.html;
      finalText = templateContent.text;
      finalSubject = finalSubject || `Purchase Confirmed: ${mergedTemplateData.orderId || "Order"}`;
    } else if (useRawHtml !== true) {
      const themedEmail = buildPremiumEmailTemplate({
        title: finalSubject || "CarScout Notification",
        subtitle,
        bodyHtml: finalHtml,
        bodyText: finalText
      });

      finalHtml = themedEmail.html;
      finalText = themedEmail.text;
    }

    if (!recipient) {
      return res.status(400).json({
        success: false,
        message: "Recipient is required (to or email)"
      });
    }

    if (!finalSubject) {
      return res.status(400).json({
        success: false,
        message: "Subject is required"
      });
    }

    if (!finalText && !finalHtml) {
      return res.status(400).json({
        success: false,
        message: "Either text or html is required"
      });
    }

    const { info, provider } = await sendEmail({
      to: recipient,
      subject: finalSubject,
      text: finalText,
      html: finalHtml,
      from
    });

    return res.status(200).json({
      success: true,
      message: "Email sent",
      messageId: info.messageId,
      provider
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to send email",
      error: error.message
    });
  }
};

module.exports = {
  sendMail
};
