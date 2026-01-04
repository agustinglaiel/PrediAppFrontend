import { useEffect, useState } from "react";
import { getUpcomingSessions, getPastSessions } from "../api/sessions";
import { getProdeByUserAndSession } from "../api/prodes";

/* helper */
const flagUrlFor = (countryName) => {
  if (!countryName) return "/images/flags/default.jpg";
  return `/images/flags/${countryName.toLowerCase()}.jpg`;
};

const circuitLayoutFor = (location) => {
  if (!location) return "/images/circuitLayouts/default.png";
  return `/images/circuitLayouts/${location.toLowerCase()}.png`;
};

const normalizeSession = (s) => {
  const start = new Date(s.date_start);
  const end = new Date(s.date_end);
  return {
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
  };
};

const groupSessionsByWeekend = (sessions = []) => {
  const map = {};
  sessions.forEach((s) => {
    const id = s.weekend_id;
    if (!map[id]) {
      map[id] = {
        weekendId: id,
        country: s.country_name || s.country || "Unknown",
        circuit: s.circuit_short_name || s.circuit || "Unknown Circuit",
        location: s.location,
        flagUrl: flagUrlFor(s.country_name || s.country),
        circuitLayoutUrl: circuitLayoutFor(s.location || s.circuit_short_name),
        sessions: [],
        earliestDate: s.date_start,
        year: s.year,
      };
    }
    map[id].sessions.push(normalizeSession(s));
  });
  return Object.values(map);
};

const groupPastSessionsByYear = (payload = []) => {
  return payload.map((yearBlock) => {
    const events = groupSessionsByWeekend(yearBlock.sessions || []);
    events.sort((a, b) => new Date(b.earliestDate) - new Date(a.earliestDate));
    return {
      year: yearBlock.year,
      events,
    };
  });
};

/* hook */
export default function useWeekendEvents(userId) {
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [error, setError] = useState(null);
  /* helper interno para enriquecer - evita repetir código */
  const enrichEventList = (events, setter) => {
    if (!userId) return; // No enriquecer si no hay userId
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
          sess.hasPronostico = !!prode; // Actualizar hasPronostico basado en si hay prode
        } catch {
          /* ignore */
        } finally {
          if (!setter) return;
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
  }, []); // Eliminamos userId de las dependencias

  /* ── Pasados ──────────────────────────────────────────────── */
  useEffect(() => {
    let cancelled = false;

    getPastSessions()
      .then((raw) => {
        if (cancelled) return;
        const groupedByYear = groupPastSessionsByYear(raw);
        setPast(groupedByYear);

        if (!userId) return;
        groupedByYear.forEach((block) => {
          enrichEventList(block.events, (updated) => {
            if (cancelled) return null;
            setPast((prev) =>
              prev.map((yearBlock) =>
                yearBlock.year === block.year
                  ? { ...yearBlock, events: updated }
                  : yearBlock
              )
            );
          });
        });
      })
      .catch((err) => !cancelled && setError(err));

    return () => {
      cancelled = true;
    };
  }, []); // Eliminamos userId de las dependencias

  return { upcoming, past, error };
}
