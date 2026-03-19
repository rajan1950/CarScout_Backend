const Notification = require("../models/NotificationModel");

const createNotification = async ({
  recipientId,
  type = "system",
  title,
  body,
  data = {},
  priority = "medium",
  channel = "in_app",
  expiresAt = null
}) => {
  if (!recipientId || !title || !body) {
    return null;
  }

  return Notification.create({
    recipientId,
    type,
    title,
    body,
    data,
    priority,
    channel,
    expiresAt
  });
};

module.exports = {
  createNotification
};
