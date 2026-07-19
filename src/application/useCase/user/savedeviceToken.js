const savedeviceToken = async (deviceToken, platform, repositories) => {
  try {
    if (!deviceToken) {
      return { status: false, message: "Device token is required" };
    }

    const result = await repositories.saveDeviceToken(deviceToken, platform);
    if (!result?.status) {
      return result;
    }

    return { status: true, message: "Device token saved successfully", result };
  } catch (error) {
    console.error("Error saving device token:", error);
    return { status: false, message: "Error saving device token" };
  }
};

export default savedeviceToken;
