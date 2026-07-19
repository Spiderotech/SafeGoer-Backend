import { runAnalysis } from "../../../analysis/analysisEngine.js";

/**
 * Run rule-based scam analysis for URL, SMS, email, or QR decoded value.
 * @param {{type:string,value:string}} input
 * @param {object} repositories
 * @param {object} authService
 * @returns {Promise<object>}
 */
const analyzeContent = async (input, repositories, authService) => {
  try {
    return await runAnalysis(input, {
      repository: repositories,
      authService,
    });
  } catch (error) {
    console.error("Analysis engine error:", error);
    return {
      status: false,
      message: "Unable to analyze content",
      error: error.message,
    };
  }
};

export default analyzeContent;
