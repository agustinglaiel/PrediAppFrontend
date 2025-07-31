// src/hooks/useRaceProdeResult.js
import { useState, useEffect } from "react";
import { getProdeByUserAndSession } from "../api/prodes";
import { getSessionById } from "../api/sessions";
import { getDriverById } from "../api/drivers";
import { getTopNDriversInSession } from "../api/results";

/**
 * Hook para página de resultado de carrera (race).
 * Carga:
 *  - detalles de la sesión (debe ser Race)
 *  - prode del usuario (con p1..p5, vsc, sc, dnf)
 *  - nombres de los pilotos pronosticados por el usuario
 *  - topN resultados reales (driver_id + nombre)
 *  - vsc/sc/dnf reales (de sessionData)
 */
export default function useRaceProdeResult({ sessionId, userId, topN = 5 }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionInfo, setSessionInfo] = useState(null);
  const [prode, setProde] = useState(null);
  const [userDrivers, setUserDrivers] = useState({
    p1: null,
    p2: null,
    p3: null,
    p4: null,
    p5: null,
  });
  const [realDriversList, setRealDriversList] = useState([]); // [{ driver_id, full_name }]
  const [realRaceExtras, setRealRaceExtras] = useState({
    vsc: false,
    sc: false,
    dnf: 0,
  });
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
        // Cargar sesión y prode en paralelo (prode puede ser null)
        const [sessionData, userProde] = await Promise.all([
          getSessionById(parsedSessionId),
          userId ? getProdeByUserAndSession(parseInt(userId, 10), parsedSessionId) : Promise.resolve(null),
        ]);

        if (cancelled) return;

        // Verificar que es carrera
        if (
          sessionData.session_type !== "Race" ||
          sessionData.session_name !== "Race"
        ) {
          // no setear error, la página puede decidir redirigir
          setSessionInfo({
            countryName: sessionData.country_name || "Unknown",
            flagUrl: sessionData.country_name
              ? `/images/flags/${sessionData.country_name.toLowerCase()}.jpg`
              : "/images/flags/default.jpg",
            sessionType: sessionData.session_type,
            sessionName: sessionData.session_name,
            dateStart: sessionData.date_start || null,
          });
          setProde(null);
          setMissingProde(true);
          setRealDriversList([]);
          setRealRaceExtras({
            vsc: sessionData.vsc || false,
            sc: sessionData.sc || false,
            dnf: sessionData.dnf || 0,
          });
          return;
        }

        // Session info
        setSessionInfo({
          countryName: sessionData.country_name || "Unknown",
          flagUrl: sessionData.country_name
            ? `/images/flags/${sessionData.country_name.toLowerCase()}.jpg`
            : "/images/flags/default.jpg",
          sessionType: sessionData.session_type || "Race",
          sessionName: sessionData.session_name || "Race",
          dateStart: sessionData.date_start || null,
        });

        // Real extras (vsc/sc/dnf) vienen de sessionData
        setRealRaceExtras({
          vsc: !!sessionData.vsc,
          sc: !!sessionData.sc,
          dnf: typeof sessionData.dnf === "number" ? sessionData.dnf : 0,
        });

        // Prode del usuario
        if (!userProde) {
          setMissingProde(true);
          setProde(null);
        } else {
          setProde(userProde);
          const userDriverPromises = [
            userProde.p1 ? getDriverById(userProde.p1) : Promise.resolve(null),
            userProde.p2 ? getDriverById(userProde.p2) : Promise.resolve(null),
            userProde.p3 ? getDriverById(userProde.p3) : Promise.resolve(null),
            userProde.p4 ? getDriverById(userProde.p4) : Promise.resolve(null),
            userProde.p5 ? getDriverById(userProde.p5) : Promise.resolve(null),
          ];
          const [
            driverP1,
            driverP2,
            driverP3,
            driverP4,
            driverP5,
          ] = await Promise.all(userDriverPromises);
          if (cancelled) return;
          setUserDrivers({
            p1: driverP1 ? driverP1.full_name : null,
            p2: driverP2 ? driverP2.full_name : null,
            p3: driverP3 ? driverP3.full_name : null,
            p4: driverP4 ? driverP4.full_name : null,
            p5: driverP5 ? driverP5.full_name : null,
          });
        }

        // Top N reales
        const topDrivers = await getTopNDriversInSession(parsedSessionId, topN);
        if (cancelled) return;
        const realDriverPromises = topDrivers.map((d) =>
          getDriverById(d.driver_id)
        );
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
    userDrivers, // nombres pronosticados
    realDriversList, // array topN reales
    realRaceExtras, // { vsc, sc, dnf }
    missingProde,
  };
}
