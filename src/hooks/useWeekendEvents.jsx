import { useEffect, useState } from "react";
import { getUpcomingSessions, getPastSessionsByYear } from "../api/sessions";
import { getProdeByUserAndSession } from "../api/prodes";

/* helper */
const groupSessionsByWeekend = (sessions = []) => {
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
  return Object.values(map);
};

/* hook */
export default function useWeekendEvents(userId) {
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [error, setError] = useState(null);
  const currentYear = new Date().getFullYear();

  /* helper interno para enriquecer - evita repetir código */
  const enrichEventList = (events, setter) => {
    const mut = structuredClone(events);
    mut.forEach((ev) =>
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
          /* actualizar inmediatamente esta sesión */
          setter((prev) =>
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

  /* ── Próximos ─────────────────────────────────────────────── */
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    getUpcomingSessions()
      .then((raw) => {
        if (cancelled) return;
        const grouped = groupSessionsByWeekend(raw);
        grouped.sort(
          (a, b) => new Date(a.earliestDate) - new Date(b.earliestDate)
        );
        setUpcoming(grouped); // pinta enseguida
        enrichEventList(grouped, (v) => (!cancelled ? setUpcoming(v) : null));
      })
      .catch((err) => !cancelled && setError(err));

    return () => {
      cancelled = true;
    };
  }, [userId]);

  /* ── Pasados ──────────────────────────────────────────────── */
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    getPastSessionsByYear(currentYear)
      .then((raw) => {
        if (cancelled) return;
        const grouped = groupSessionsByWeekend(raw);
        grouped.sort(
          (a, b) => new Date(b.earliestDate) - new Date(a.earliestDate)
        );
        setPast(grouped);
        enrichEventList(grouped, (v) => (!cancelled ? setPast(v) : null));
      })
      .catch((err) => !cancelled && setError(err));

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return { upcoming, past, error };
}
