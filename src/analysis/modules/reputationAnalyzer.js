import { parseDomainParts } from "./domainAnalyzer.js";

/**
 * Check local reputation collections.
 * @param {URL|null} url
 * @param {object} repository
 * @returns {Promise<{module:string, score:number, status:string, passed:boolean, details:string[], reputation?:object}>}
 */
const reputationAnalyzer = async (url, repository) => {
  if (!url || !repository?.findDomainReputation) {
    return {
      module: "reputationAnalyzer",
      score: 0,
      status: "skipped",
      passed: true,
      details: ["No reputation repository available"],
    };
  }

  const { hostname, rootDomain } = parseDomainParts(url.hostname);
  const reputation = await repository.findDomainReputation(hostname, rootDomain);

  if (reputation.blockedDomain) {
    return {
      module: "reputationAnalyzer",
      score: 95,
      status: "failed",
      passed: false,
      details: ["Domain is in blocked domain database"],
      reputation,
    };
  }

  if (reputation.knownScam) {
    return {
      module: "reputationAnalyzer",
      score: 95,
      status: "failed",
      passed: false,
      details: ["Domain matches a known scam record"],
      reputation,
    };
  }

  if (reputation.trustedDomain) {
    return {
      module: "reputationAnalyzer",
      score: -20,
      status: "passed",
      passed: true,
      details: ["Domain is in trusted domain database"],
      reputation,
    };
  }

  return {
    module: "reputationAnalyzer",
    score: 0,
    status: "passed",
    passed: true,
    details: ["No negative local reputation found"],
    reputation,
  };
};

export default reputationAnalyzer;
