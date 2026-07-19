import { parseDomainParts } from "./domainAnalyzer.js";

const trustedBrands = [
  { name: "google", domains: ["google.com"] },
  { name: "microsoft", domains: ["microsoft.com", "office.com", "live.com"] },
  { name: "amazon", domains: ["amazon.com", "amazon.co.uk", "amazon.in"] },
  { name: "apple", domains: ["apple.com"] },
  { name: "facebook", domains: ["facebook.com", "fb.com"] },
  { name: "instagram", domains: ["instagram.com"] },
  { name: "paypal", domains: ["paypal.com"] },
  { name: "netflix", domains: ["netflix.com"] },
  { name: "royalmail", label: "royal mail", domains: ["royalmail.com"] },
  { name: "hmrc", domains: ["gov.uk"] },
  { name: "dvla", domains: ["gov.uk"] },
  { name: "ups", domains: ["ups.com"] },
  { name: "fedex", domains: ["fedex.com"] },
  { name: "dpd", domains: ["dpd.com", "dpd.co.uk"] },
];

const lookalikeMap = {
  "0": "o",
  "1": "l",
  "3": "e",
  "4": "a",
  "5": "s",
  "@": "a",
  "$": "s",
  "|": "l",
};

const normalizeLookalikes = (value = "") =>
  value
    .toLowerCase()
    .split("")
    .map(char => lookalikeMap[char] || char)
    .join("");

const levenshteinDistance = (a = "", b = "") => {
  const matrix = Array.from({ length: b.length + 1 }, (_, row) => [row]);

  for (let col = 0; col <= a.length; col += 1) {
    matrix[0][col] = col;
  }

  for (let row = 1; row <= b.length; row += 1) {
    for (let col = 1; col <= a.length; col += 1) {
      matrix[row][col] =
        b[row - 1] === a[col - 1]
          ? matrix[row - 1][col - 1]
          : Math.min(
              matrix[row - 1][col - 1] + 1,
              matrix[row][col - 1] + 1,
              matrix[row - 1][col] + 1,
            );
    }
  }

  return matrix[b.length][a.length];
};

/**
 * Detect brand impersonation and typosquatting.
 * @param {URL|null} url
 * @returns {{module:string, score:number, status:string, passed:boolean, details:string[]}}
 */
const typoAnalyzer = (url) => {
  if (!url) {
    return {
      module: "typoAnalyzer",
      score: 0,
      status: "skipped",
      passed: true,
      details: ["No valid URL for typosquatting analysis"],
    };
  }

  const { hostname, rootDomain } = parseDomainParts(url.hostname);
  const normalizedHost = normalizeLookalikes(hostname.replace(/[-_.]/g, ""));
  const details = [];
  let score = 0;

  trustedBrands.forEach(brand => {
    const brandKey = brand.name;
    const isOfficial = brand.domains.some(domain => rootDomain === domain || hostname.endsWith(`.${domain}`));
    const containsBrand = normalizedHost.includes(brandKey);

    if (containsBrand && !isOfficial) {
      score += 35;
      details.push(`Possible ${brand.label || brand.name} brand impersonation`);
      return;
    }

    const rootLabel = rootDomain.split(".")[0];
    const distance = levenshteinDistance(normalizeLookalikes(rootLabel), brandKey);
    if (!isOfficial && distance > 0 && distance <= 2) {
      score += 28;
      details.push(`Possible typo-squatting of ${brand.label || brand.name}`);
    }
  });

  return {
    module: "typoAnalyzer",
    score: Math.min(score, 100),
    status: score > 0 ? "warning" : "passed",
    passed: score === 0,
    details: details.length ? details : ["No obvious brand impersonation detected"],
  };
};

export default typoAnalyzer;
