// src/hooks/useStoredScore.js
import { useEffect, useState } from "react";
import { getStoredScore, SCORE_KEY, SCORE_UPDATED_EVENT } from "../utils/scoreStorage";

export default function useStoredScore() {
  const [score, setScore] = useState(() => getStoredScore());

  useEffect(() => {
    // Cambios en otras pestañas
    const onStorage = (e) => {
      if (e.key === SCORE_KEY) {
        const n = Number(e.newValue);
        setScore(Number.isFinite(n) ? n : 0);
      }
    };
    // Cambios locales (misma pestaña)
    const onLocalUpdate = (e) => {
      const v = e?.detail?.value;
      setScore(Number.isFinite(v) ? v : getStoredScore());
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener(SCORE_UPDATED_EVENT, onLocalUpdate);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(SCORE_UPDATED_EVENT, onLocalUpdate);
    };
  }, []);

  return score;
}
