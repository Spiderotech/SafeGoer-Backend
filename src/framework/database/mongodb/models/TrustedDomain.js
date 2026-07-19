import { Schema, model } from "mongoose";

const trustedDomainSchema = new Schema(
  {
    hostname: { type: String, required: true, unique: true, lowercase: true, trim: true },
    brand: { type: String, trim: true },
    notes: { type: String, trim: true },
  },
  { timestamps: true },
);

const TrustedDomain = model("trusted_domains", trustedDomainSchema);
export default TrustedDomain;
