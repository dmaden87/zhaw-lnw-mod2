// Zentrale Konfiguration. Modellnamen per Umgebungsvariable änderbar (siehe docs/modellwahl.md).
export const config = {
  embedModel: process.env.EMBED_MODEL || 'gemini-embedding-2',
  fastModel: process.env.GEN_MODEL_FAST || 'gemini-3.5-flash-lite',
  fullModel: process.env.GEN_MODEL_FULL || 'gemini-3.5-flash',
  fallbackModel: process.env.GEN_MODEL_FALLBACK || 'gemini-flash-lite-latest',
  dims: 768,
};
