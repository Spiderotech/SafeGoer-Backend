import { Schema, model } from "mongoose";

const blockedDomainSchema = new Schema(
  {
    hostname: { type: String, required: true, unique: true, lowercase: true, trim: true },
    reason: { type: String, trim: true },
    source: { type: String, trim: true },
  },
  { timestamps: true },
);

const BlockedDomain = model("blocked_domains", blockedDomainSchema);
export default BlockedDomain;
