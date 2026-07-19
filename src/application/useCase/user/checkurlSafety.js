

const checkurlSafety = async (url, authService) => {
  try {
    const result = await authService.checkUrlSafety(url);
    return result;
  } catch (error) {
    console.error("Error in checkUrlSafety use case:", error);
    throw error;
  }
};

export default checkurlSafety;
