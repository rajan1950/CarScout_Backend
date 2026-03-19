const express = require("express");

const {
  createNotificationForUser,
  getMyNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification
} = require("../controller/NotificationController");

const validateToken = require("../middleware/AuthMiddleware");

const router = express.Router();

// localhost:4444/notification/create
router.post("/create", validateToken, createNotificationForUser);
// localhost:4444/notification/my
router.get("/my", validateToken, getMyNotifications);
// localhost:4444/notification/unread-count
router.get("/unread-count", validateToken, getUnreadNotificationCount);
// localhost:4444/notification/:id/read
router.patch("/:id/read", validateToken, markNotificationAsRead);
// localhost:4444/notification/read-all
router.patch("/read-all", validateToken, markAllNotificationsAsRead);
// localhost:4444/notification/:id
router.delete("/:id", validateToken, deleteNotification);

module.exports = router;
