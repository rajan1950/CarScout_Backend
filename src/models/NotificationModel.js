const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true
    },

    type: {
      type: String,
      enum: ["message", "inquiry", "test_drive", "review", "system"],
      default: "system"
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },

    body: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000
    },

    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },

    isRead: {
      type: Boolean,
      default: false
    },

    readAt: {
      type: Date,
      default: null
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    },

    channel: {
      type: String,
      enum: ["in_app", "email", "both"],
      default: "in_app"
    },

    expiresAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

notificationSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Notification", notificationSchema);
