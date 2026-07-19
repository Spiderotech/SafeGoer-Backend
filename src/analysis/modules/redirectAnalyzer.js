import axios from "axios";

/**
 * Follow redirects without allowing infinite redirect chains.
 * @param {string} normalizedUrl
 * @returns {Promise<{module:string, score:number, status:string, passed:boolean, details:string[], finalUrl:string, redirectCount:number}>}
 */
const redirectAnalyzer = async (normalizedUrl) => {
  const details = [];
  const visited = new Set();
  let currentUrl = normalizedUrl;
  let redirectCount = 0;
  let score = 0;

  try {
    for (let index = 0; index < 5; index += 1) {
      if (visited.has(currentUrl)) {
        score += 45;
        details.push("Redirect loop detected");
        break;
      }

      visited.add(currentUrl);
      const response = await axios.get(currentUrl, {
        maxRedirects: 0,
        timeout: 5000,
        validateStatus: status => status >= 200 && status < 400,
      });

      const location = response.headers.location;
      if (!location || response.status < 300) {
        break;
      }

      currentUrl = new URL(location, currentUrl).toString();
      redirectCount += 1;
    }

    if (redirectCount >= 5) {
      score += 25;
      details.push("Too many redirects detected");
    } else if (redirectCount > 2) {
      score += 10;
      details.push("Multiple redirects detected");
    }
  } catch (error) {
    details.push(`Redirect check incomplete: ${error.message}`);
    score += 5;
  }

  return {
    module: "redirectAnalyzer",
    score: Math.min(score, 100),
    status: score > 0 ? "warning" : "passed",
    passed: score === 0,
    details: details.length ? details : ["No risky redirect behavior detected"],
    finalUrl: currentUrl,
    redirectCount,
  };
};

export default redirectAnalyzer;
