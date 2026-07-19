const getOverallRisk = (safetyScore) => {
  if (safetyScore >= 90) return "Very Safe";
  if (safetyScore >= 70) return "Safe";
  if (safetyScore >= 50) return "Medium Risk";
  if (safetyScore >= 30) return "High Risk";
  return "Dangerous";
};

/**
 * Merge module risk scores into one safety score.
 * @param {Array<{score:number}>} checks
 * @returns {{riskScore:number, checksRiskScore:number, overallRisk:string}}
 */
const scoringEngine = (checks = []) => {
  const riskPoints = checks.reduce((total, check) => total + Number(check.score || 0), 0);
  const checksRiskScore = Math.max(0, Math.min(100, Math.round(riskPoints)));
  const riskScore = Math.max(0, 100 - checksRiskScore);

  return {
    riskScore,
    checksRiskScore,
    overallRisk: getOverallRisk(riskScore),
  };
};

export default scoringEngine;
