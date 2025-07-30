// src/utils/date.js
export function formatArgTime(isoString) {
  if (!isoString) return "--:--";
  const date = new Date(isoString);
  if (isNaN(date)) return "--:--";
  return new Intl.DateTimeFormat("es-AR", {
    hour:   "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Argentina/Buenos_Aires"
  }).format(date);
}
