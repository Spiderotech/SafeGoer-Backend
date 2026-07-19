import domainAnalyzer from "./modules/domainAnalyzer.js";
import emailAnalyzer from "./modules/emailAnalyzer.js";
import keywordAnalyzer from "./modules/keywordAnalyzer.js";
import qrAnalyzer from "./modules/qrAnalyzer.js";
import redirectAnalyzer from "./modules/redirectAnalyzer.js";
import reputationAnalyzer from "./modules/reputationAnalyzer.js";
import safeBrowsingAnalyzer from "./modules/safeBrowsingAnalyzer.js";
import smsAnalyzer from "./modules/smsAnalyzer.js";
import sslAnalyzer from "./modules/sslAnalyzer.js";
import typoAnalyzer from "./modules/typoAnalyzer.js";
import urlAnalyzer from "./modules/urlAnalyzer.js";
import recommendationEngine from "./recommendationEngine.js";
import scoringEngine from "./scoringEngine.js";

const getSummary = (overallRisk) => {
  if (overallRisk === "Dangerous") return "Dangerous scam indicators detected";
  if (overallRisk === "High Risk") return "Potential phishing or scam content detected";
  if (overallRisk === "Medium Risk") return "Some suspicious indicators were found";
  return "No major scam indicators detected";
};

/**
 * Analyze one URL through all URL-related modules.
 * @param {string} value
 * @param {string} contextText
 * @param {{authService?:object, repository?:object}} dependencies
 * @returns {Promise<object>}
 */
const analyzeUrl = async (value, contextText = "", dependencies = {}) => {
  const urlCheck = urlAnalyzer(value);
  const checks = [urlCheck];

  if (urlCheck.url) {
    const redirectCheck = await redirectAnalyzer(urlCheck.normalizedUrl);
    const finalUrl = new URL(redirectCheck.finalUrl || urlCheck.normalizedUrl);

    checks.push(
      domainAnalyzer(finalUrl),
      await sslAnalyzer(finalUrl),
      redirectCheck,
      await safeBrowsingAnalyzer(finalUrl.toString(), dependencies.authService),
      typoAnalyzer(finalUrl),
      keywordAnalyzer(`${contextText} ${finalUrl.toString()}`),
      await reputationAnalyzer(finalUrl, dependencies.repository),
    );
  }

  const score = scoringEngine(checks);
  return {
    status: true,
    type: "url",
    normalizedValue: urlCheck.normalizedUrl,
    ...score,
    summary: getSummary(score.overallRisk),
    checks,
    recommendations: recommendationEngine(checks),
  };
};

/**
 * Main rule-based scam analysis entrypoint.
 * @param {{type:string,value:string}} input
 * @param {{authService?:object, repository?:object}} dependencies
 * @returns {Promise<object>}
 */
export const runAnalysis = async (input, dependencies = {}) => {
  const type = String(input?.type || "").toLowerCase();
  const value = String(input?.value || "").trim();

  if (!value) {
    return { status: false, message: "Analysis value is required" };
  }

  if (type === "url") {
    return analyzeUrl(value, value, dependencies);
  }

  if (type === "sms") {
    const smsCheck = await smsAnalyzer(value, url => analyzeUrl(url, value, dependencies));
    const nestedChecks = smsCheck.urlResults.flatMap(result => result.checks || []);
    const checks = [smsCheck, ...nestedChecks];
    const score = scoringEngine(checks);
    return {
      status: true,
      type,
      ...score,
      summary: getSummary(score.overallRisk),
      checks,
      recommendations: recommendationEngine(checks),
    };
  }

  if (type === "email") {
    const emailCheck = await emailAnalyzer(value, url => analyzeUrl(url, value, dependencies));
    const nestedChecks = emailCheck.urlResults.flatMap(result => result.checks || []);
    const checks = [emailCheck, ...nestedChecks];
    const score = scoringEngine(checks);
    return {
      status: true,
      type,
      ...score,
      summary: getSummary(score.overallRisk),
      checks,
      recommendations: recommendationEngine(checks),
    };
  }

  if (type === "qr") {
    const qrCheck = await qrAnalyzer(value, url => analyzeUrl(url, value, dependencies));
    const checks = [qrCheck, ...(qrCheck.urlResult?.checks || [])];
    const score = scoringEngine(checks);
    return {
      status: true,
      type,
      ...score,
      summary: getSummary(score.overallRisk),
      checks,
      recommendations: recommendationEngine(checks),
    };
  }

  return { status: false, message: "Unsupported analysis type" };
};

export default { run: runAnalysis };
