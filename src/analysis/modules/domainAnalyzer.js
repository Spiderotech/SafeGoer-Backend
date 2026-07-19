const suspiciousTlds = new Set([
  "zip",
  "mov",
  "click",
  "top",
  "xyz",
  "tk",
  "ml",
  "ga",
  "cf",
  "gq",
  "work",
  "support",
  "quest",
]);

/**
 * Extract basic domain parts from a hostname.
 * @param {string} hostname
 * @returns {{hostname:string, rootDomain:string, tld:string, subdomain:string}}
 */
export const parseDomainParts = (hostname = "") => {
  const cleanHostname = hostname.toLowerCase().replace(/^www\./, "");
  const parts = cleanHostname.split(".").filter(Boolean);
  const tld = parts.at(-1) || "";
  const rootDomain = parts.length >= 2 ? parts.slice(-2).join(".") : cleanHostname;
  const subdomain = parts.length > 2 ? parts.slice(0, -2).join(".") : "";

  return { hostname: cleanHostname, rootDomain, tld, subdomain };
};

/**
 * Analyze TLD and domain structure risk.
 * @param {URL|null} url
 * @returns {{module:string, score:number, status:string, passed:boolean, details:string[], domain?:object}}
 */
const domainAnalyzer = (url) => {
  if (!url) {
    return {
      module: "domainAnalyzer",
      score: 100,
      status: "failed",
      passed: false,
      details: ["Domain could not be parsed"],
    };
  }

  const domain = parseDomainParts(url.hostname);
  const details = [];
  let score = 0;

  if (suspiciousTlds.has(domain.tld)) {
    score += 25;
    details.push(`Suspicious TLD detected: .${domain.tld}`);
  }

  if (domain.subdomain && domain.subdomain.split(".").length > 3) {
    score += 12;
    details.push("Domain has many nested subdomains");
  }

  return {
    module: "domainAnalyzer",
    score,
    status: score > 0 ? "warning" : "passed",
    passed: score === 0,
    details: details.length ? details : ["Domain structure looks normal"],
    domain,
  };
};

export default domainAnalyzer;
