/**
 * Analyze decoded QR value.
 * @param {string} value
 * @param {Function} analyzeUrl
 * @returns {Promise<object>}
 */
const qrAnalyzer = async (value, analyzeUrl) => {
  const raw = String(value || "").trim();
  const looksLikeUrl = /^https?:\/\//i.test(raw) || /^(?:[a-z0-9-]+\.)+[a-z]{2,}/i.test(raw);

  if (!looksLikeUrl) {
    return {
      module: "qrAnalyzer",
      score: 0,
      status: "unsupported",
      passed: false,
      details: ["QR value is not a supported URL"],
    };
  }

  const result = await analyzeUrl(raw, raw);
  return {
    module: "qrAnalyzer",
    score: result.checksRiskScore || 0,
    status: result.overallRisk,
    passed: result.status,
    details: ["QR URL analyzed"],
    urlResult: result,
  };
};

export default qrAnalyzer;
