let admin;
const setup = (msg) => Object.assign(new Error("Server setup problem: " + msg), { status: 500 });

const init = async () => {
  if (admin) return;
  let mod;
  try { mod = (await import("firebase-admin")).default; }
  catch { throw setup("firebase-admin is not installed. Make sure package.json lists it, then redeploy."); }
  if (!mod.apps.length) {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (!raw) throw setup("FIREBASE_SERVICE_ACCOUNT is missing, or its scope doesn't include Functions.");
    let key;
    try { key = JSON.parse(raw); } catch { throw setup("FIREBASE_SERVICE_ACCOUNT is not valid JSON. Paste the whole key file again."); }
    try { mod.initializeApp({ credential: mod.credential.cert(key) }); }
    catch (e) { throw setup("the key was rejected: " + String(e.message).slice(0, 120)); }
  }
  admin = mod;
};

export const db = {
  doc: (p) => admin.firestore().doc(p),
  runTransaction: (fn) => admin.firestore().runTransaction(fn),
};

export const verify = async (event) => {
  await init();
  const token = (event.headers.authorization || "").replace("Bearer ", "");
  if (!token) throw Object.assign(new Error("Please sign in again."), { status: 401 });
  try { return (await admin.auth().verifyIdToken(token)).uid; }
  catch { throw Object.assign(new Error("Please sign in again."), { status: 401 }); }
};

export const reply = (status, body) => ({ statusCode: status, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
