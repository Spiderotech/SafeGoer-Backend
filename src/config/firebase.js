import admin from "firebase-admin";
import fs from "fs";

const serviceAccountPath =
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH ||
  new URL("./serviceAccountKey.json", import.meta.url);

let firebaseReady = false;

try {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)
    : JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  firebaseReady = true;
} catch (error) {
  console.warn(
    "Firebase admin is not configured. Push notifications will be skipped.",
    error.message
  );
}

export { firebaseReady };
export default admin;
