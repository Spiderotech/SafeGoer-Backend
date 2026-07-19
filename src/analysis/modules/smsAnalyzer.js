import keywordAnalyzer from "./keywordAnalyzer.js";

export const extractUrls = (text = "") => {
  const matches = String(text).match(/https?:\/\/[^\s]+|(?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/[^\s]*)?/gi);
  return [...new Set(matches || [])];
};

export const extractPhoneNumbers = (text = "") => {
  const matches = String(text).match(/(?:\+?\d[\d\s().-]{7,}\d)/g);
  return [...new Set(matches || [])];
};

/**
 * Analyze SMS body and run extracted URLs through the engine.
 * @param {string} text
 * @param {Function} analyzeUrl
 * @returns {Promise<object>}
 */
const smsAnalyzer = async (text, analyzeUrl) => {
  const urls = extractUrls(text);
  const phoneNumbers = extractPhoneNumbers(text);
  const keywordCheck = keywordAnalyzer(text);
  const urlResults = await Promise.all(urls.map(url => analyzeUrl(url, text)));

  return {
    module: "smsAnalyzer",
    score: Math.min(keywordCheck.score + (phoneNumbers.length > 0 ? 8 : 0), 100),
    status: keywordCheck.score > 0 || urls.length > 0 ? "warning" : "passed",
    passed: keywordCheck.score === 0,
    details: [
      `${urls.length} URL(s) extracted`,
      `${phoneNumbers.length} phone number(s) extracted`,
      ...keywordCheck.details,
    ],
    urls,
    phoneNumbers,
    urlResults,
  };
};

export default smsAnalyzer;
