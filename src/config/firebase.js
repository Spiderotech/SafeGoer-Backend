import admin from "firebase-admin";
import fs from "fs";

const serviceAccountPath =
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH ||
  new URL("./serviceAccountKey.json", import.meta.url);

let firebaseReady = false;

try {
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath));

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
