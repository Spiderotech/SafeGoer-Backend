import dotenv from "dotenv";
dotenv.config();

const accessTokenSecret =
  process.env.JWT_ACCESS_SECRET || process.env.ACCESS_TOKEN_SECRET || "";
const refreshTokenSecret =
  process.env.JWT_REFRESH_SECRET || process.env.REFRESH_TOKEN_SECRET || "";

export default {
  port: process.env.PORT || 3000,

  mongo: {
    uri: process.env.MONGO_URI || ''
  },

  ACCESS_TOKEN_SECRET: accessTokenSecret,
  REFRESH_TOKEN_SECRET: refreshTokenSecret,

  S3_ACCESS_KEY: process.env.S3_ACCESS_KEY || process.env.AWS_ACCESS_KEY_ID || "",
  S3_SECRET_KEY: process.env.S3_SECRET_KEY || process.env.AWS_SECRET_ACCESS_KEY || "",
  S3_REGION: process.env.S3_REGION || process.env.AWS_REGION || "ap-south-1",
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME || "scam-awareness-project",
};
