import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert(require(process.env.GOOGLE_APPLICATION_CREDENTIALS as string)),
});

const firestore = admin.firestore();

export { firestore };