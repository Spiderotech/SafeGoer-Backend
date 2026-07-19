import scamdata from "../../../entities/admin/Scamdata.js";
import admin, { firebaseReady } from "../../../config/firebase.js";

const invalidTokenErrorCodes = new Set([
  "messaging/invalid-registration-token",
  "messaging/registration-token-not-registered",
  "messaging/invalid-argument",
]);

const createNewScam = async (
  title,
  subtitle,
  description,
  category,
  subcategory,
  location,
  tags,
  images,
  details,
  repositories
) => {
  try {
    const data = scamdata(
      title,
      subtitle,
      description,
      category,
      subcategory,
      location,
      tags,
      images,
      details
    );

    const product = await repositories.createnewScam(data);

    // ✅ Fetch device tokens
    const { status, data: tokens } = await repositories.getAllDeviceTokens();

    if (!firebaseReady) {
      console.log("Firebase is not configured. Skipping notifications.");
    } else if (status && tokens?.length > 0) {
      const payload = {
        notification: {
          title: "New Scam Alert",
          body: `${title} - ${subtitle}`,
        },
        android: {
          priority: "high",
          notification: {
            channelId: "scam_alerts",
            sound: "default",
          },
        },
        data: {
          type: "NEW_SCAM_ALERT",
          scamId: product?.data?._id?.toString() || "",
          title: title || "",
          risk: details?.risk || "High",
          scamType: details?.scamType || category || "",
        },
      };

      // Send in batches (max 500 per request)
      const batchSize = 500;
      let totalSuccess = 0;
      let totalFailure = 0;
      const invalidTokens = [];

      for (let i = 0; i < tokens.length; i += batchSize) {
        const batch = tokens.slice(i, i + batchSize);
        const result = await admin.messaging().sendEachForMulticast({
          tokens: batch,
          ...payload,
        });

        totalSuccess += result.successCount;
        totalFailure += result.failureCount;

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
        await repositories.removeDeviceTokens(invalidTokens);
      }

      console.log("FCM notification result:", {
        tokenCount: tokens.length,
        successCount: totalSuccess,
        failureCount: totalFailure,
        removedInvalidTokens: invalidTokens.length,
      });
    } else {
      console.log("⚠️ No tokens found or failed to fetch.");
    }

    return { status: true, product };
  } catch (error) {
    console.error("❌ Error creating scam or sending notifications:", error);
    return { message: "Error creating scam", status: false };
  }
};

export default createNewScam;
