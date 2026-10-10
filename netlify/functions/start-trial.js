import { db, verify, reply } from "./lib/admin.js";

const TRIAL_MS = 30 * 24 * 60 * 60 * 1000;

export const handler = async (event) => {
  try {
    const uid = await verify(event);
    const ref = db.doc(`users/${uid}`);
    const premiumUntil = await db.runTransaction(async (tx) => {
      const u = (await tx.get(ref)).data() || {};
      if (u.trialUsed) return null;
      const until = Date.now() + TRIAL_MS;
      tx.set(ref, { trialUsed: true, premiumUntil: until }, { merge: true });
      return until;
    });
    if (!premiumUntil) return reply(409, { error: "Your free trial has already been used." });
    return reply(200, { premiumUntil });
  } catch (e) { return reply(e.status || 500, { error: e.message }); }
};
