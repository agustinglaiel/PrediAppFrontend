// src/utils/sessions.js

import { HashRouter } from "react-router-dom";
import { formatArgTime } from "./date"; 

/**
 * Agrupa un array de sesiones por weekend_id en la forma que usan tus componentes.
 */
export function groupSessionsByWeekend(sessions = []) {
  const map = {};
  sessions.forEach((s) => {
    const id = s.weekend_id;
    if (!map[id]) {
      map[id] = {
        weekendId: id,
        country: s.country_name || "Unknown",
        circuit: s.circuit_short_name || "Unknown Circuit",
        flagUrl: s.country_name
          ? `/images/flags/${s.country_name.toLowerCase()}.jpg`
          : "/images/flags/default.jpg",
        circuitLayoutUrl: s.country_name
          ? `/images/circuitLayouts/${s.location.toLowerCase()}.png`
          : "/images/circuitLayouts/default.png",
        sessions: [],
        earliestDate: s.date_start,
      };
    }

    const start = new Date(s.date_start);
    const end = new Date(s.date_end);

    map[id].sessions.push({
      id: s.id,
      date: start.getDate().toString(),
      month: start
        .toLocaleString("en", { month: "short" })
        .toUpperCase(),
      sessionName: s.session_name,
      sessionType: s.session_type,
      startTime: formatArgTime(s.date_start),
      endTime: formatArgTime(s.date_end), 
      date_start: s.date_start,
      date_end: s.date_end,
      hasPronostico: true,
      prodeSession: null,
      prodeRace: null,
      score: null,
      weekend_id: s.weekend_id,
      circuit_key: s.circuit_key,
      circuit_short_name: s.circuit_short_name,
      country_code: s.country_code,
      country_name: s.country_name,
      location: s.location,
      year: s.year,
    });
  });

  return Object.values(map);
}

/**
 * Toma el array de eventos agrupados y reemplaza
 * startTime / endTime por formato Argentina (es-AR, UTC-3).
 */
export function withArgentinaTimes(events = []) {
  return events.map((ev) => ({
    ...ev,
    sessions: ev.sessions.map((sess) => ({
      ...sess,
      startTime: formatArgTime(sess.date_start),
      endTime: formatArgTime(sess.date_end),
    })),
  }));
}
