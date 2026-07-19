import keywordAnalyzer from "./keywordAnalyzer.js";
import { extractPhoneNumbers, extractUrls } from "./smsAnalyzer.js";

const extractEmails = (text = "") => {
  const matches = String(text).match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi);
  return [...new Set(matches || [])];
};

/**
 * Analyze email body and run extracted URLs through the engine.
 * @param {string} text
 * @param {Function} analyzeUrl
 * @returns {Promise<object>}
 */
const emailAnalyzer = async (text, analyzeUrl) => {
  const urls = extractUrls(text);
  const emails = extractEmails(text);
  const phoneNumbers = extractPhoneNumbers(text);
  const keywordCheck = keywordAnalyzer(text);
  const urlResults = await Promise.all(urls.map(url => analyzeUrl(url, text)));

  return {
    module: "emailAnalyzer",
    score: Math.min(keywordCheck.score + (emails.length > 2 ? 8 : 0), 100),
    status: keywordCheck.score > 0 || urls.length > 0 ? "warning" : "passed",
    passed: keywordCheck.score === 0,
    details: [
      `${urls.length} URL(s) extracted`,
      `${emails.length} email address(es) extracted`,
      `${phoneNumbers.length} phone number(s) extracted`,
      ...keywordCheck.details,
    ],
    urls,
    emails,
    phoneNumbers,
    urlResults,
  };
};

export default emailAnalyzer;
