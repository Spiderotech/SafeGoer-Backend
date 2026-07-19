/**
 * Wrap the existing Google Safe Browsing service.
 * @param {string} normalizedUrl
 * @param {object} authService
 * @returns {Promise<{module:string, score:number, status:string, passed:boolean, details:string[], threats:string[]}>}
 */
const safeBrowsingAnalyzer = async (normalizedUrl, authService) => {
  if (!authService?.checkUrlSafety) {
    return {
      module: "safeBrowsingAnalyzer",
      score: 0,
      status: "skipped",
      passed: true,
      details: ["Safe Browsing service is not configured"],
      threats: [],
    };
  }

  try {
    const result = await authService.checkUrlSafety(normalizedUrl);
    const threats = result?.threats || [];
    const unsafe = result?.safe === false || threats.length > 0;

    return {
      module: "safeBrowsingAnalyzer",
      score: unsafe ? 90 : 0,
      status: unsafe ? "failed" : "passed",
      passed: !unsafe,
      details: unsafe ? [`Google Safe Browsing threats: ${threats.join(", ")}`] : ["No Google Safe Browsing match"],
      threats,
    };
  } catch (error) {
    return {
      module: "safeBrowsingAnalyzer",
      score: 0,
      status: "skipped",
      passed: true,
      details: [`Safe Browsing check unavailable: ${error.message}`],
      threats: [],
    };
  }
};

export default safeBrowsingAnalyzer;
