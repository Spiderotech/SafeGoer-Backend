import tls from "tls";

const connectTls = (hostname) =>
  new Promise((resolve, reject) => {
    const socket = tls.connect(
      {
        host: hostname,
        servername: hostname,
        port: 443,
        timeout: 5000,
        rejectUnauthorized: false,
      },
      () => {
        const certificate = socket.getPeerCertificate();
        const authorized = socket.authorized;
        const authorizationError = socket.authorizationError;
        socket.end();
        resolve({ certificate, authorized, authorizationError });
      },
    );

    socket.on("timeout", () => {
      socket.destroy();
      reject(new Error("TLS connection timed out"));
    });

    socket.on("error", reject);
  });

/**
 * Analyze HTTPS and certificate state.
 * @param {URL|null} url
 * @returns {Promise<{module:string, score:number, status:string, passed:boolean, details:string[]}>}
 */
const sslAnalyzer = async (url) => {
  if (!url) {
    return {
      module: "sslAnalyzer",
      score: 0,
      status: "skipped",
      passed: true,
      details: ["No valid URL for SSL analysis"],
    };
  }

  const details = [];
  let score = 0;

  if (url.protocol !== "https:") {
    return {
      module: "sslAnalyzer",
      score: 35,
      status: "warning",
      passed: false,
      details: ["HTTPS is missing"],
    };
  }

  try {
    const result = await connectTls(url.hostname);
    const validTo = result.certificate?.valid_to
      ? new Date(result.certificate.valid_to)
      : null;

    if (validTo && validTo.getTime() < Date.now()) {
      score += 35;
      details.push("SSL certificate is expired");
    }

    if (!result.authorized && result.authorizationError) {
      score += 25;
      details.push(`Certificate validation warning: ${result.authorizationError}`);
    }
  } catch (error) {
    score += 20;
    details.push(`Unable to verify SSL certificate: ${error.message}`);
  }

  return {
    module: "sslAnalyzer",
    score: Math.min(score, 100),
    status: score > 0 ? "warning" : "passed",
    passed: score === 0,
    details: details.length ? details : ["HTTPS certificate checks passed"],
  };
};

export default sslAnalyzer;
