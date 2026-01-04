import { useEffect, useState } from "react";
import { getUpcomingSessions, getPastSessions } from "../api/sessions";
import { groupSessionsByWeekend } from "../utils/sessions";

export default function useSessionsGrouped(year) {
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const [upcomingRaw, pastPayload] = await Promise.all([
        getUpcomingSessions(),
        getPastSessions(),
      ]);

      const pastRaw = (pastPayload.find((block) => block.year === year)?.sessions) || [];

      const filteredUpcoming = upcomingRaw.filter(
        (s) => new Date(s.date_start).getFullYear() === year
      );

      const groupedUpcoming = groupSessionsByWeekend(filteredUpcoming).sort(
        (a, b) => new Date(a.earliestDate) - new Date(b.earliestDate)
      );
      const groupedPast = groupSessionsByWeekend(pastRaw).sort(
        (a, b) => new Date(b.earliestDate) - new Date(a.earliestDate)
      );

      setUpcoming(groupedUpcoming);
      setPast(groupedPast);
    } catch (err) {
      setError(err.message || "Error al cargar sesiones.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [year]);

  return { upcoming, past, loading, error, refetch: fetchSessions };
}
