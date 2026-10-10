import { db, verify, reply } from "./lib/admin.js";

const LIMIT = 6;
const lagosDay = () => new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Lagos" });

export const handler = async (event) => {
  try {
    const uid = await verify(event);
    const { lessonId } = JSON.parse(event.body || "{}");
    if (!lessonId) return reply(400, { error: "Missing lesson." });
    const ref = db.doc(`users/${uid}`);
    const out = await db.runTransaction(async (tx) => {
      const u = (await tx.get(ref)).data() || {};
      const date = lagosDay();
      const played = u.playedDate === date ? (u.played || []) : [];
      if ((u.premiumUntil || 0) > Date.now() || played.includes(lessonId)) return { allowed: true, played, date };
      if (played.length >= LIMIT) return { allowed: false, played, date };
      const next = [...played, lessonId];
      tx.set(ref, { playedDate: date, played: next }, { merge: true });
      return { allowed: true, played: next, date };
    });
    return reply(200, out);
  } catch (e) { return reply(e.status || 500, { error: e.message }); }
};
