// src/utils/scoreStorage.js
export const SCORE_KEY = "predi:userScore";
export const SEASON_YEAR_KEY = "predi:seasonYear";
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

// Devuelve el season year almacenado o null
export function getStoredSeasonYear() {
  try {
    const raw = localStorage.getItem(SEASON_YEAR_KEY);
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

// Guarda y emite evento para re-render inmediato en esta pestaña
export function setStoredScore(score, seasonYear) {
  try {
    const value = String(Number(score) || 0);
    localStorage.setItem(SCORE_KEY, value);
    if (seasonYear != null) {
      localStorage.setItem(SEASON_YEAR_KEY, String(seasonYear));
    }
    window.dispatchEvent(new CustomEvent(SCORE_UPDATED_EVENT, { detail: { value: Number(value), seasonYear: seasonYear ?? getStoredSeasonYear() } }));
  } catch {
    // no-op
  }
}

export function clearStoredScore() {
  try {
    localStorage.removeItem(SCORE_KEY);
    localStorage.removeItem(SEASON_YEAR_KEY);
    window.dispatchEvent(new CustomEvent(SCORE_UPDATED_EVENT, { detail: { value: 0, seasonYear: null } }));
  } catch {
    // no-op
  }
}
