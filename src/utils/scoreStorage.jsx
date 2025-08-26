// src/utils/scoreStorage.js
export const SCORE_KEY = "predi:userScore";
export const SCORE_UPDATED_EVENT = "predi:score-updated";

// Devuelve siempre un número (fallback 0)
export function getStoredScore() {
  try {
    const raw = localStorage.getItem(SCORE_KEY);
    const n = Number(raw);
    return Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
}

// Guarda y emite evento para re-render inmediato en esta pestaña
export function setStoredScore(score) {
  try {
    const value = String(Number(score) || 0);
    localStorage.setItem(SCORE_KEY, value);
    window.dispatchEvent(new CustomEvent(SCORE_UPDATED_EVENT, { detail: { value: Number(value) } }));
  } catch {
    // no-op
  }
}

export function clearStoredScore() {
  try {
    localStorage.removeItem(SCORE_KEY);
    window.dispatchEvent(new CustomEvent(SCORE_UPDATED_EVENT, { detail: { value: 0 } }));
  } catch {
    // no-op
  }
}
