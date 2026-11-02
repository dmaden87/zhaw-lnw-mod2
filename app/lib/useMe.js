'use client';
import { useEffect, useState } from 'react';

// Angemeldete Person und Rolle (für die Oberfläche; die Berechtigung prüft immer der Server)
let cache = null;
export function useMe() {
  const [me, setMe] = useState(cache);
  useEffect(() => {
    if (cache) return;
    fetch('/api/me').then((r) => (r.ok ? r.json() : null)).then((d) => { cache = d; setMe(d); }).catch(() => {});
  }, []);
  return me;
}
const RANK = { user: 1, superuser: 2, kipm: 3, admin: 4 };
export const atLeast = (me, role) => Boolean(me) && RANK[me.role] >= RANK[role];
