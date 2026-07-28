import mongoose from "mongoose";
mongoose.set("strictQuery", true);

const connectDB = async (config) => {
  if (!config.mongo.uri) {
    console.error("MONGO_URI is not configured. Database-backed routes will be unavailable.");
    return false;
  }

  try {
    await mongoose.connect(config.mongo.uri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`Database connected successfully`);
    return true;
  } catch (error) {
    console.error("Database connection failed:", error.message);
    return false;
  }
};

export default connectDB;
