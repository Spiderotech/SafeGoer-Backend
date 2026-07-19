import { Schema, model } from "mongoose";

const knownScamSchema = new Schema(
  {
    hostname: { type: String, required: true, lowercase: true, trim: true, index: true },
    title: { type: String, trim: true },
    risk: { type: String, default: "High", trim: true },
    source: { type: String, trim: true },
  },
  { timestamps: true },
);

const KnownScam = model("known_scams", knownScamSchema);
export default KnownScam;
