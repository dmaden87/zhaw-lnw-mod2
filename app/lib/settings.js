// Einstellungen (Feature-Toggles) in der Datenbank, 30 s zwischengespeichert
import { db } from './db';

export const DEFAULTS = { general_knowledge: true };
let cache = null; let at = 0;

export async function getSettings(fresh = false) {
  if (!fresh && cache && Date.now() - at < 30_000) return cache;
  try {
    const rows = await db().query('SELECT key, value FROM settings');
    cache = { ...DEFAULTS, ...Object.fromEntries(rows.map((r) => [r.key, r.value])) };
  } catch {
    cache = { ...DEFAULTS };
  }
  at = Date.now();
  return cache;
}

export async function setSetting(key, value, by) {
  if (!(key in DEFAULTS)) throw new Error(`Unbekannte Einstellung ${key}`);
  await db().query(
    `INSERT INTO settings (key, value, updated_at, updated_by) VALUES ($1, $2::jsonb, now(), $3)
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now(), updated_by = EXCLUDED.updated_by`,
    [key, JSON.stringify(value), by]);
  cache = null;
  return getSettings(true);
}
