import { Schema, model } from "mongoose";

const scamSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    subcategory: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    scamType: {
      type: String,
      trim: true,
      default: "",
    },
    tags: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    risk: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "High",
    },
    brand: {
      type: String,
      trim: true,
      default: "",
    },
    happening: {
      type: String,
      trim: true,
      default: "",
    },
    warningSigns: {
      type: [String],
      default: [],
    },
    actions: {
      type: [String],
      default: [],
    },
    website: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true, versionKey: false }
);

const Scam = model("scams", scamSchema);
export default Scam;
