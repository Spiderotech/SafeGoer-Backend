import login from "../../../application/useCase/admin/login.js";
import createNewScam from "../../../application/useCase/admin/createNewScam.js";
import editScam from "../../../application/useCase/admin/editScam.js";
import deleteScam from "../../../application/useCase/admin/deleteScam.js";
import getAllScams from "../../../application/useCase/admin/getAllScams.js";
import getScamById from "../../../application/useCase/admin/getScamById.js";
import admin, { firebaseReady } from "../../../config/firebase.js";

const invalidTokenErrorCodes = new Set([
  "messaging/invalid-registration-token",
  "messaging/registration-token-not-registered",
  "messaging/invalid-argument",
]);

const adminController = (adminRepositoryInt, adminRepositoryImp, adminServiceInt, adminServiceImp) => {
  const dbrepository = adminRepositoryInt(adminRepositoryImp());
  const authService = adminServiceInt(adminServiceImp());

  // Admin login
  const adminLogin = (req, res) => {
    const { email, password } = req.body;
    login(email, password, dbrepository, authService)
      .then(response => res.json(response))
      .catch(err => console.log(err));
  };

  // Create new scam
  const addScamData = (req, res) => {
  console.log("Request body:", req.body);

  const {
    title,
    subtitle,
    description,
    category,
    subcategory,
    location,
    scamType,
    tags,
    images,
    risk,
    brand,
    happening,
    warningSigns,
    actions,
    website,
    status,
  } = req.body;
  const details = { scamType, risk, brand, happening, warningSigns, actions, website, status };
  console.log(title, subtitle, description, category, subcategory, location, tags, images, details,"controller");

  createNewScam(title, subtitle, description, category, subcategory, location, tags, images, details, dbrepository)
    .then(response => res.json(response))
    .catch(err => console.error(err));
};


  // Edit scam
  const editScamData = (req, res) => {
    const { id } = req.params;
   const {
    title,
    subtitle,
    description,
    category,
    subcategory,
    location,
    scamType,
    tags,
    images,
    risk,
    brand,
    happening,
    warningSigns,
    actions,
    website,
    status,
  } = req.body;
    const details = { scamType, risk, brand, happening, warningSigns, actions, website, status };
    editScam(id, title, subtitle, description, category, subcategory, location, tags, images, details, dbrepository)
      .then(response => res.json(response))
      .catch(err => console.log(err));
  };

  // Delete scam
  const deleteScamData = (req, res) => {
    const { id } = req.params;
    deleteScam(id, dbrepository)
      .then(response => res.json(response))
      .catch(err => console.log(err));
  };

  // Get all scams
  const getAllScamsData = (req, res) => {
    getAllScams(dbrepository)
      .then(response => res.json(response))
      .catch(err => console.log(err));
  };

  // Get scam by ID
  const getscamById = (req, res) => {
    const { id } = req.params;
    getScamById(id, dbrepository)
      .then(response => res.json(response))
      .catch(err => console.log(err));
  };

  const sendNotificationToTokens = async ({ title, message, scamId = "" }) => {
    const { status, data: tokens } = await dbrepository.getAllDeviceTokens();

    if (!firebaseReady) {
      return { status: false, sentCount: 0, message: "Firebase is not configured" };
    }

    if (!status || !tokens?.length) {
      return { status: false, sentCount: 0, message: "No device tokens found" };
    }

    const payload = {
      notification: {
        title,
        body: message,
      },
      android: {
        priority: "high",
        notification: {
          channelId: "scam_alerts",
          sound: "default",
        },
      },
      data: {
        type: "ADMIN_NOTIFICATION",
        scamId: scamId || "",
      },
    };

    let sentCount = 0;
    let failureCount = 0;
    const invalidTokens = [];
    const batchSize = 500;
    for (let i = 0; i < tokens.length; i += batchSize) {
      const batch = tokens.slice(i, i + batchSize);
      const result = await admin.messaging().sendEachForMulticast({
        tokens: batch,
        ...payload,
      });
      sentCount += result.successCount;
      failureCount += result.failureCount;

      result.responses.forEach((response, index) => {
        if (!response.success) {
          const code = response.error?.code || "unknown";
          console.error("FCM send failed:", {
            code,
            message: response.error?.message,
            tokenPreview: `${batch[index].slice(0, 12)}...`,
          });

          if (invalidTokenErrorCodes.has(code)) {
            invalidTokens.push(batch[index]);
          }
        }
      });
    }

    if (invalidTokens.length > 0) {
      await dbrepository.removeDeviceTokens(invalidTokens);
    }

    console.log("FCM admin notification result:", {
      tokenCount: tokens.length,
      successCount: sentCount,
      failureCount,
      removedInvalidTokens: invalidTokens.length,
    });

    return {
      status: sentCount > 0,
      sentCount,
      failureCount,
      message: sentCount > 0 ? "Notification sent" : "No notifications were delivered",
    };
  };

  const sendNotification = async (req, res) => {
    try {
      const { title, message, scamId = "" } = req.body;

      if (!title || !message) {
        return res.status(400).json({ status: false, message: "Title and message are required" });
      }

      if (scamId) {
        const scam = await dbrepository.getScamById(scamId);
        if (!scam?.status) {
          return res.status(404).json({ status: false, message: "Target scam alert was not found" });
        }
      }

      const sendResult = await sendNotificationToTokens({ title, message, scamId });

      const campaign = await dbrepository.createNotificationCampaign({
        title,
        message,
        scamId,
        mode: "now",
        status: sendResult.status ? "Sent" : "Failed",
        sentAt: sendResult.status ? new Date() : null,
        sentCount: sendResult.sentCount,
      });

      return res.json({ ...sendResult, campaign: campaign.data });
    } catch (error) {
      console.error("Error sending notification:", error);
      return res.status(500).json({ status: false, message: "Error sending notification" });
    }
  };

  const scheduleNotification = async (req, res) => {
    try {
      const { title, message, scamId = "", scheduledAt } = req.body;

      if (!title || !message || !scheduledAt) {
        return res.status(400).json({ status: false, message: "Title, message and scheduledAt are required" });
      }

      if (scamId) {
        const scam = await dbrepository.getScamById(scamId);
        if (!scam?.status) {
          return res.status(404).json({ status: false, message: "Target scam alert was not found" });
        }
      }

      const scheduleDate = new Date(scheduledAt);
      if (Number.isNaN(scheduleDate.getTime())) {
        return res.status(400).json({ status: false, message: "Invalid scheduledAt date" });
      }

      const campaign = await dbrepository.createNotificationCampaign({
        title,
        message,
        scamId,
        mode: "schedule",
        status: "Scheduled",
        scheduledAt: scheduleDate,
      });

      return res.json({ status: true, message: "Notification scheduled", campaign: campaign.data });
    } catch (error) {
      console.error("Error scheduling notification:", error);
      return res.status(500).json({ status: false, message: "Error scheduling notification" });
    }
  };

  const getNotificationHistory = (req, res) => {
    dbrepository.getNotificationCampaigns()
      .then(response => res.json(response))
      .catch(err => console.log(err));
  };

  return {
    adminLogin,
    addScamData,
    editScamData,
    deleteScamData,
    getAllScamsData,
    getscamById,
    sendNotification,
    scheduleNotification,
    getNotificationHistory,
  };
};

export default adminController;
