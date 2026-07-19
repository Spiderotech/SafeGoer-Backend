import { Schema, model } from "mongoose";

const notificationCampaignSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    scamId: {
      type: String,
      default: "",
      trim: true,
    },
    mode: {
      type: String,
      enum: ["now", "schedule"],
      default: "now",
    },
    status: {
      type: String,
      enum: ["Sent", "Scheduled", "Failed"],
      default: "Scheduled",
    },
    scheduledAt: {
      type: Date,
      default: null,
    },
    sentAt: {
      type: Date,
      default: null,
    },
    sentCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, versionKey: false }
);

const NotificationCampaign = model("notification_campaigns", notificationCampaignSchema);
export default NotificationCampaign;
