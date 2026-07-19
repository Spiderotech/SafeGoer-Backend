import Scam from "../../models/scamModel.js";
import DeviceToken from "../../models/DeviceToken.js"; // Import the model
import TrustedDomain from "../../models/TrustedDomain.js";
import BlockedDomain from "../../models/BlockedDomain.js";
import KnownScam from "../../models/KnownScam.js";
import mongoose from "mongoose";

const userRepositoryImp = () => {
  const getAllScams = async () => {
    try {
      const scams = await Scam.find().sort({ createdAt: -1 });
      console.log("Fetched scams:", scams);
      return { status: true, data: scams };
    } catch (error) {
      console.error("Error fetching scams:", error);
      return { status: false, message: "Error fetching scams", error };
    }
  };

  const getScamById = async (scamId) => {
    try {
      const scam = await Scam.findById(scamId);
      if (!scam) return { status: false, message: "Scam not found" };
      return { status: true, data: scam };
    } catch (error) {
      console.error("Error fetching scam:", error);
      return { status: false, message: "Error fetching scam", error };
    }
  };

  const getScamUpdates = async (since) => {
    try {
      const sinceDate = since ? new Date(since) : new Date(0);
      if (Number.isNaN(sinceDate.getTime())) {
        return { status: false, message: "Invalid since date" };
      }

      const scams = await Scam.find({
        $or: [
          { createdAt: { $gt: sinceDate } },
          { updatedAt: { $gt: sinceDate } },
        ],
      }).sort({ updatedAt: -1 });

      return {
        status: true,
        data: scams,
        serverTime: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error fetching scam updates:", error);
      return { status: false, message: "Error fetching scam updates", error };
    }
  };

  // ✅ Save device token (prevent duplicates)
  const saveDeviceToken = async (token, platform = "unknown") => {
    try {
      // Check if token already exists
      const existing = await DeviceToken.findOne({ token });
      if (existing) {
        existing.platform = platform || existing.platform;
        await existing.save();
        return { status: true, message: "Token already exists" };
      }

      // Save new token
      const newToken = new DeviceToken({ token, platform });
      await newToken.save();

      return { status: true, message: "Token saved successfully" };
    } catch (error) {
      console.error("Error saving device token:", error);
      return { status: false, message: "Error saving device token", error };
    }
  };

  const findDomainReputation = async (hostname, rootDomain) => {
    try {
      const domainsToCheck = [hostname, rootDomain].filter(Boolean);
      const [trustedDomain, blockedDomain, knownScam] = await Promise.all([
        TrustedDomain.findOne({ hostname: { $in: domainsToCheck } }).lean(),
        BlockedDomain.findOne({ hostname: { $in: domainsToCheck } }).lean(),
        KnownScam.findOne({ hostname: { $in: domainsToCheck } }).lean(),
      ]);

      return {
        trustedDomain,
        blockedDomain,
        knownScam,
      };
    } catch (error) {
      console.error("Error checking domain reputation:", error);
      return {
        trustedDomain: null,
        blockedDomain: null,
        knownScam: null,
        error: error.message,
      };
    }
  };

  return {
    getAllScams,
    getScamById,
    getScamUpdates,
    saveDeviceToken, // export the new function
    findDomainReputation,
  };
};

export default userRepositoryImp;
