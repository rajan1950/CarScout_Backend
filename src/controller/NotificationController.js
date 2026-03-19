const Notification = require("../models/NotificationModel");
const { createNotification } = require("../services/NotificationService");

const createNotificationForUser = async (req, res) => {
  try {
    const notification = await createNotification(req.body);

    if (!notification) {
      return res.status(400).json({
        message: "recipientId, title and body are required"
      });
    }

    return res.status(201).json({
      message: "Notification created successfully",
      data: notification
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const getMyNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({ recipientId: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Notification.countDocuments({ recipientId: req.user.id });

    return res.status(200).json({
      message: "Notifications fetched successfully",
      page,
      limit,
      total,
      data: notifications
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const getUnreadNotificationCount = async (req, res) => {
  try {
    const unreadCount = await Notification.countDocuments({
      recipientId: req.user.id,
      isRead: false
    });

    return res.status(200).json({
      unreadCount
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipientId: req.user.id },
      { isRead: true, readAt: new Date() },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found"
      });
    }

    return res.status(200).json({
      message: "Notification marked as read",
      data: notification
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const markAllNotificationsAsRead = async (req, res) => {
  try {
    const updateResult = await Notification.updateMany(
      { recipientId: req.user.id, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    return res.status(200).json({
      message: "All unread notifications marked as read",
      modifiedCount: updateResult.modifiedCount
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const deleteNotification = async (req, res) => {
  try {
    const deletedNotification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipientId: req.user.id
    });

    if (!deletedNotification) {
      return res.status(404).json({
        message: "Notification not found"
      });
    }

    return res.status(200).json({
      message: "Notification deleted successfully"
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = {
  createNotificationForUser,
  getMyNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification
};
