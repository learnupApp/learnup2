export const handler = async () => {
  const out = {};
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  out.keyPresent = !!raw;
  out.keyLength = raw ? raw.length : 0;
  let key;
  try {
    key = JSON.parse(raw);
    out.keyIsJson = true;
    out.keyProject = key.project_id;
    out.keyHasPrivateKey = typeof key.private_key === "string" && key.private_key.includes("BEGIN PRIVATE KEY");
  } catch { out.keyIsJson = false; }
  try {
    const m = (await import("firebase-admin")).default;
    out.adminLoads = true;
    if (key) {
      if (!m.apps.length) m.initializeApp({ credential: m.credential.cert(key) });
      const late = new Promise((_, no) => setTimeout(() => no(new Error("Firestore did not answer within 6 seconds")), 6000));
      await Promise.race([m.firestore().doc("diagnostics/ping").get(), late]);
      out.firestoreReachable = true;
    }
  } catch (e) { out.error = String(e.message).slice(0, 200); }
  return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify(out, null, 2) };
};
