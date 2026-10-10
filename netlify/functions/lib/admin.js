import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) });
}
export const db = admin.firestore();

export const verify = async (event) => {
  const token = (event.headers.authorization || "").replace("Bearer ", "");
  if (!token) throw Object.assign(new Error("Please sign in again."), { status: 401 });
  try { return (await admin.auth().verifyIdToken(token)).uid; }
  catch { throw Object.assign(new Error("Please sign in again."), { status: 401 }); }
};

export const reply = (status, body) => ({ statusCode: status, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
