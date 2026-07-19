import { Schema, model } from "mongoose";

const deviceTokenSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true, // Prevent duplicate tokens
      trim: true,
    },
    platform: {
      type: String,
      default: "unknown",
      trim: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

const DeviceToken = model("device_tokens", deviceTokenSchema);
export default DeviceToken;
