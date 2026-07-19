const recommendationMap = {
  "URL does not use HTTPS": "Never enter passwords or payment details on non-HTTPS pages.",
  "HTTPS is missing": "Avoid submitting personal data until the site uses HTTPS.",
  "URL shortener detected": "Open shortened links only if you fully trust the sender.",
  "Google Safe Browsing threats": "Leave the page immediately and do not download anything.",
  "brand impersonation": "Visit the official website manually instead of using this link.",
  "typo-squatting": "Check the spelling of the website address carefully.",
  "blocked domain": "Do not interact with this website because it appears in a blocklist.",
  "known scam": "Do not continue. This matches known scam data.",
  "OTP": "Never share OTPs or one-time codes with anyone.",
  "password": "Do not enter passwords from links received in messages.",
};

/**
 * Generate user-facing safety advice from triggered checks.
 * @param {Array<{details:string[]}>} checks
 * @returns {string[]}
 */
const recommendationEngine = (checks = []) => {
  const recommendations = new Set();
  const detailText = checks.flatMap(check => check.details || []);

  detailText.forEach(detail => {
    Object.entries(recommendationMap).forEach(([signal, recommendation]) => {
      if (detail.toLowerCase().includes(signal.toLowerCase())) {
        recommendations.add(recommendation);
      }
    });
  });

  if (recommendations.size === 0) {
    recommendations.add("Still verify the sender and website address before sharing sensitive information.");
  }

  return Array.from(recommendations);
};

export default recommendationEngine;
