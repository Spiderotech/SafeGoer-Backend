const shortenerDomains = new Set([
  "bit.ly",
  "tinyurl.com",
  "t.co",
  "is.gd",
  "cutt.ly",
  "rebrand.ly",
  "shorturl.at",
  "goo.gl",
  "ow.ly",
  "buff.ly",
]);

const ipAddressPattern =
  /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.|$)){4}$/;

/**
 * Normalize raw user input into a URL object.
 * @param {string} value
 * @returns {{url: URL|null, normalizedUrl: string, error?: string}}
 */
export const normalizeUrl = (value = "") => {
  const trimmed = String(value).trim();
  if (!trimmed) {
    return { url: null, normalizedUrl: "", error: "URL is empty" };
  }

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const url = new URL(withProtocol);
    return { url, normalizedUrl: url.toString() };
  } catch {
    return { url: null, normalizedUrl: trimmed, error: "Invalid URL format" };
  }
};

/**
 * Analyze URL structure signals.
 * @param {string} value
 * @returns {{module:string, score:number, status:string, passed:boolean, details:string[], normalizedUrl?:string, url?:URL|null}}
 */
const urlAnalyzer = (value) => {
  const { url, normalizedUrl, error } = normalizeUrl(value);
  const details = [];
  let score = 0;

  if (!url) {
    return {
      module: "urlAnalyzer",
      score: 100,
      status: "failed",
      passed: false,
      details: [error || "Invalid URL"],
      normalizedUrl,
      url,
    };
  }

  const hostname = url.hostname.toLowerCase();
  const subdomainCount = hostname.split(".").length - 2;

  if (url.protocol !== "https:") {
    score += 18;
    details.push("URL does not use HTTPS");
  }

  if (ipAddressPattern.test(hostname)) {
    score += 35;
    details.push("URL uses an IP address instead of a domain");
  }

  if (shortenerDomains.has(hostname)) {
    score += 30;
    details.push("URL shortener detected");
  }

  if (/[<>{}[\]|\\^`]/.test(normalizedUrl)) {
    score += 15;
    details.push("Suspicious URL characters detected");
  }

  if (subdomainCount > 3) {
    score += 15;
    details.push("Excessive subdomains detected");
  }

  if (normalizedUrl.length > 140) {
    score += 12;
    details.push("URL is unusually long");
  }

  if (/%[0-9a-f]{2}/i.test(normalizedUrl)) {
    score += 12;
    details.push("Encoded URL characters detected");
  }

  if (url.username || url.password) {
    score += 35;
    details.push("URL contains username or password fields");
  }

  return {
    module: "urlAnalyzer",
    score: Math.min(score, 100),
    status: score > 0 ? "warning" : "passed",
    passed: score === 0,
    details: details.length ? details : ["URL structure looks normal"],
    normalizedUrl,
    url,
  };
};

export default urlAnalyzer;
