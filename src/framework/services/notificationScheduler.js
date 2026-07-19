import admin, { firebaseReady } from "../../config/firebase.js";
import DeviceToken from "../database/mongodb/models/DeviceToken.js";
import NotificationCampaign from "../database/mongodb/models/NotificationCampaign.js";

const sendCampaign = async (campaign) => {
  if (!firebaseReady) {
    campaign.status = "Failed";
    await campaign.save();
    return;
  }

  const tokens = await DeviceToken.find({}, "token").lean();
  const tokenList = tokens.map(item => item.token).filter(Boolean);

  if (tokenList.length === 0) {
    campaign.status = "Failed";
    await campaign.save();
    return;
  }

  let sentCount = 0;
  const batchSize = 500;
  for (let i = 0; i < tokenList.length; i += batchSize) {
    const batch = tokenList.slice(i, i + batchSize);
    const result = await admin.messaging().sendEachForMulticast({
      tokens: batch,
      notification: {
        title: campaign.title,
        body: campaign.message,
      },
      data: {
        type: "ADMIN_NOTIFICATION",
        scamId: campaign.scamId || "",
      },
    });
    sentCount += result.successCount;
  }

  campaign.status = "Sent";
  campaign.sentAt = new Date();
  campaign.sentCount = sentCount;
  await campaign.save();
};

export const startNotificationScheduler = () => {
  const run = async () => {
    try {
      const dueCampaigns = await NotificationCampaign.find({
        mode: "schedule",
        status: "Scheduled",
        scheduledAt: { $lte: new Date() },
      }).limit(20);

      for (const campaign of dueCampaigns) {
        await sendCampaign(campaign);
      }
    } catch (error) {
      console.error("Notification scheduler error:", error);
    }
  };

  setTimeout(run, 5000);
  setInterval(run, 60 * 1000);
};
