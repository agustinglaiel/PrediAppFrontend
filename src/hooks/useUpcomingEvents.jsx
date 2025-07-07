// src/hooks/useUpcomingEvents.js
import { useEffect, useState } from "react";
import { getUpcomingSessions } from "../api/sessions";
import { getProdeByUserAndSession } from "../api/prodes";

const groupSessionsByWeekend = (sessions = []) => {
  const map = {};
  sessions.forEach((s) => {
    const id = s.weekend_id;
    if (!map[id]) {
      map[id] = {
        weekendId: id,
        country: s.country_name,
        circuit: s.circuit_short_name,
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
      month: start.toLocaleString("en", { month: "short" }).toUpperCase(),
      sessionName: s.session_name,
      sessionType: s.session_type,
      startTime: start.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      endTime: end.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      date_start: s.date_start,
      date_end: s.date_end,
      hasPronostico: true,
      prodeSession: null,
      prodeRace: null,
      score: null,
    });
  });

  return Object.values(map).sort(
    (a, b) => new Date(a.earliestDate) - new Date(b.earliestDate)
  );
};

/* hook ─────────────────────────────────────────────────────── */
export default function useUpcomingEvents(userId) {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  /* enriquecedor reutilizable */
  const enrich = (weekends) => {
    const copy = structuredClone(weekends);
    copy.forEach((ev) =>
      ev.sessions.forEach(async (sess) => {
        try {
          const prode = await getProdeByUserAndSession(
            parseInt(userId, 10),
            sess.id
          );
          const isRace = sess.sessionType.toLowerCase() === "race";
          sess.prodeRace = isRace ? prode : null;
          sess.prodeSession = !isRace ? prode : null;
          sess.score = prode ? prode.score ?? null : null;
        } catch {
          /* ignore */
        } finally {
          /* actualizar SOLO esa sesión */
          setEvents((prev) =>
            prev.map((evPrev) =>
              evPrev.weekendId === ev.weekendId
                ? {
                    ...evPrev,
                    sessions: evPrev.sessions.map((s) =>
                      s.id === sess.id ? { ...sess } : s
                    ),
                  }
                : evPrev
            )
          );
        }
      })
    );
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getUpcomingSessions()
      .then((raw) => {
        if (cancelled) return;
        const grouped = groupSessionsByWeekend(raw || []);
        setEvents(grouped); // render inmediato
        if (userId) enrich(grouped);
      })
      .catch((err) => !cancelled && setError(err))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return { events, loading, error };
}
