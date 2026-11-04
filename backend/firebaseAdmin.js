import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import fs from "fs";

const serviceAccount = JSON.parse(
    fs.readFileSync("./serviceAccountKey.json", "utf8")
);

const app = getApps().length === 0
    ? initializeApp({
        credential: cert(serviceAccount)
    })
    : getApps()[0];

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, FieldValue };