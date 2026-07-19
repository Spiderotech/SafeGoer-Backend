import Admin from "../../models/AdminModels.js";
import Scam from "../../models/scamModel.js";
import mongoose from "mongoose";
import DeviceToken from "../../models/DeviceToken.js";
import NotificationCampaign from "../../models/NotificationCampaign.js";




// Admin Repository Implementation
const adminRepositoryImp = () => {

  // Check if admin exists
  const adminExist = async (email, password) => {
    try {
      const admin = await Admin.findOne({ email: email });
      console.log(admin);

      if (!admin) {
        console.log("Admin not found");
        return null;
      }
      return admin;
    } catch (error) {
      console.error("Error while finding the admin:", error);
      throw new Error("An error occurred while finding the admin.");
    }
  };


  const createnewScam = async (scamUser) => {
    console.log("Creating new scam:", scamUser);

    try {
      const newScam = new Scam({
        title: scamUser?.getTitle(),
        subtitle: scamUser?.getSubtitle(),
        description: scamUser?.getDescription(),
        category: scamUser?.getCategory(),
        subcategory: scamUser?.getSubcategory(),
        location: scamUser?.getLocation(),
        scamType: scamUser?.getScamType(),
        tags: scamUser?.getTags(),
        images: scamUser?.getImages(),
        risk: scamUser?.getRisk(),
        brand: scamUser?.getBrand(),
        happening: scamUser?.getHappening(),
        warningSigns: scamUser?.getWarningSigns(),
        actions: scamUser?.getActions(),
        website: scamUser?.getWebsite(),
        status: scamUser?.getStatus(),
      });

      const saved = await newScam.save();
      return { status: true, data: saved };
    } catch (error) {
      console.error("Error creating scam:", error);
      return { status: false, message: "Error creating scam", error };
    }
  };


  const editScam = async (scamId, scamUser) => {
    try {
      const updated = await Scam.findByIdAndUpdate(
        scamId,
        {
          title: scamUser?.getTitle(),
          subtitle: scamUser?.getSubtitle(),
          description: scamUser?.getDescription(),
          category: scamUser?.getCategory(),
          subcategory: scamUser?.getSubcategory(),
          location: scamUser?.getLocation(),
          scamType: scamUser?.getScamType(),
          tags: scamUser?.getTags(),
          images: scamUser?.getImages(),
          risk: scamUser?.getRisk(),
          brand: scamUser?.getBrand(),
          happening: scamUser?.getHappening(),
          warningSigns: scamUser?.getWarningSigns(),
          actions: scamUser?.getActions(),
          website: scamUser?.getWebsite(),
          status: scamUser?.getStatus(),
        },
        { new: true } // return updated document
      );

      if (!updated) return { status: false, message: "Scam not found" };

      return { status: true, data: updated };
    } catch (error) {
      console.error("Error editing scam:", error);
      return { status: false, message: "Error editing scam", error };
    }
  };


  const deleteScam = async (scamId) => {
    try {
      const deleted = await Scam.findByIdAndDelete(scamId);
      if (!deleted) return { status: false, message: "Scam not found" };
      return { status: true, data: deleted };
    } catch (error) {
      console.error("Error deleting scam:", error);
      return { status: false, message: "Error deleting scam", error };
    }
  };



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


  const getAllDeviceTokens = async () => {
    try {
      const tokens = await DeviceToken.find({}, "token").lean();
      const tokenList = tokens.map((t) => t.token).filter(Boolean);
      console.log(`Fetched ${tokenList.length} device token(s) for notification.`);
      return { status: true, data: tokenList };
    } catch (error) {
      console.error("Error fetching device tokens:", error);
      return { status: false, message: "Error fetching tokens", error };
    }
  };

  const removeDeviceTokens = async (tokens = []) => {
    try {
      if (!tokens.length) {
        return { status: true, deletedCount: 0 };
      }

      const result = await DeviceToken.deleteMany({ token: { $in: tokens } });
      console.log(`Removed ${result.deletedCount} invalid device token(s).`);
      return { status: true, deletedCount: result.deletedCount };
    } catch (error) {
      console.error("Error removing invalid device tokens:", error);
      return { status: false, message: "Error removing invalid tokens", error };
    }
  };

  const createNotificationCampaign = async (campaign) => {
    try {
      const saved = await NotificationCampaign.create(campaign);
      return { status: true, data: saved };
    } catch (error) {
      console.error("Error saving notification campaign:", error);
      return { status: false, message: "Error saving notification campaign", error };
    }
  };

  const getNotificationCampaigns = async () => {
    try {
      const campaigns = await NotificationCampaign.find().sort({ createdAt: -1 });
      return { status: true, data: campaigns };
    } catch (error) {
      console.error("Error fetching notification campaigns:", error);
      return { status: false, message: "Error fetching notification campaigns", error };
    }
  };




  return {
    adminExist,
    createnewScam,
    editScam,
    deleteScam,
    getAllScams,
    getScamById,
    getAllDeviceTokens,
    removeDeviceTokens,
    createNotificationCampaign,
    getNotificationCampaigns
  };
};

export default adminRepositoryImp;
