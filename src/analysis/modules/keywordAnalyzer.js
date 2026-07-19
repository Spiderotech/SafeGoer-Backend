export const keywordWeights = [
  { keyword: "verify account", weight: 22 },
  { keyword: "urgent", weight: 12 },
  { keyword: "click now", weight: 15 },
  { keyword: "password", weight: 18 },
  { keyword: "otp", weight: 20 },
  { keyword: "gift card", weight: 18 },
  { keyword: "parcel", weight: 10 },
  { keyword: "tax refund", weight: 20 },
  { keyword: "bank", weight: 12 },
  { keyword: "crypto", weight: 18 },
  { keyword: "investment", weight: 16 },
  { keyword: "reward", weight: 14 },
  { keyword: "lottery", weight: 22 },
  { keyword: "limited time", weight: 14 },
  { keyword: "suspended", weight: 18 },
  { keyword: "payment failed", weight: 18 },
  { keyword: "kyc", weight: 16 },
];

/**
 * Analyze suspicious scam keywords in raw text.
 * @param {string} text
 * @returns {{module:string, score:number, status:string, passed:boolean, details:string[], matches:Array}}
 */
const keywordAnalyzer = (text = "") => {
  const normalizedText = String(text).toLowerCase();
  const matches = keywordWeights.filter(({ keyword }) => normalizedText.includes(keyword));
  const score = Math.min(
    matches.reduce((total, item) => total + item.weight, 0),
    100,
  );

  return {
    module: "keywordAnalyzer",
    score,
    status: score > 0 ? "warning" : "passed",
    passed: score === 0,
    details: matches.length
      ? matches.map(item => `Suspicious keyword found: ${item.keyword}`)
      : ["No high-risk scam keywords found"],
    matches,
  };
};

export default keywordAnalyzer;
