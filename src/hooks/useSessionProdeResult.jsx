// src/hooks/useSessionProdeResult.js
import { useState, useEffect } from "react";
import { getProdeByUserAndSession } from "../api/prodes";
import { getSessionById } from "../api/sessions";
import { getDriverById } from "../api/drivers";
import { getTopNDriversInSession } from "../api/results";

export default function useSessionProdeResult({ sessionId, userId, topN = 3 }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionInfo, setSessionInfo] = useState(null);
  const [prode, setProde] = useState(null);
  const [userDrivers, setUserDrivers] = useState({ p1: null, p2: null, p3: null });
  const [realDriversList, setRealDriversList] = useState([]); // array of { driver_id, full_name }
  const [missingProde, setMissingProde] = useState(false);

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;

    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);
        setMissingProde(false);

        const parsedSessionId = parseInt(sessionId, 10);
        const [sessionData, userProde] = await Promise.all([
          getSessionById(parsedSessionId),
          userId ? getProdeByUserAndSession(parseInt(userId, 10), parsedSessionId) : Promise.resolve(null),
        ]);

        if (cancelled) return;

        setSessionInfo({
          countryName: sessionData.country_name || "Unknown",
          flagUrl: sessionData.country_name
            ? `/images/flags/${sessionData.country_name.toLowerCase()}.jpg`
            : "/images/flags/default.jpg",
          sessionType: sessionData.session_type || "Qualifying",
          sessionName: sessionData.session_name || "Qualifying",
          dateStart: sessionData.date_start || null,
        });

        if (!userProde) {
          setMissingProde(true);
          setProde(null);
        } else {
          setProde(userProde);
          const userDriverPromises = [
            userProde.p1 ? getDriverById(userProde.p1) : Promise.resolve(null),
            userProde.p2 ? getDriverById(userProde.p2) : Promise.resolve(null),
            userProde.p3 ? getDriverById(userProde.p3) : Promise.resolve(null),
          ];
          const [driverP1, driverP2, driverP3] = await Promise.all(userDriverPromises);
          if (cancelled) return;
          setUserDrivers({
            p1: driverP1 ? driverP1.full_name : null,
            p2: driverP2 ? driverP2.full_name : null,
            p3: driverP3 ? driverP3.full_name : null,
          });
        }

        // Top N reales como lista de objetos con id y nombre
        const topDrivers = await getTopNDriversInSession(parsedSessionId, topN);
        if (cancelled) return;
        const realDriverPromises = topDrivers.map((d) => getDriverById(d.driver_id));
        const realDriverData = await Promise.all(realDriverPromises);
        if (cancelled) return;

        setRealDriversList(
          realDriverData.map((d, idx) => ({
            driver_id: topDrivers[idx]?.driver_id,
            full_name: d?.full_name || "No disponible",
          }))
        );
      } catch (err) {
        if (!cancelled) setError(err.message || "Error cargando resultados.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchAll();
    return () => {
      cancelled = true;
    };
  }, [sessionId, userId, topN]);

  return {
    loading,
    error,
    sessionInfo,
    prode,
    userDrivers, // nombres
    realDriversList, // array [{driver_id, full_name}, ...]
    missingProde,
  };
}
