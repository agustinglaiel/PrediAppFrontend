// src/hooks/useRaceProde.js
import { useState, useEffect, useMemo, useCallback } from "react";
import { getAllDrivers } from "../api/drivers";
import { createProdeCarrera, getProdeByUserAndSession } from "../api/prodes";

/**
 * @param {Object} params
 * @param {string|number} params.sessionId
 * @param {string|number} params.userId
 * @param {string} params.sessionStartDate ISO string
 * @param {Function} params.onSuccess
 * @param {Function} params.onError
 */
export default function useRaceProde({
  sessionId,
  userId,
  sessionStartDate,
  onSuccess,
  onError,
}) {
  const [allDrivers, setAllDrivers] = useState([]);
  const [loadingDrivers, setLoadingDrivers] = useState(true);
  const [driversError, setDriversError] = useState(null);

  const [formData, setFormData] = useState({
    P1: null,
    P2: null,
    P3: null,
    P4: null,
    P5: null,
    vsc: false,
    sf: false,
    dnf: 0,
  });

  const [showWarningModal, setShowWarningModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [existingProde, setExistingProde] = useState(null); // si ya hay uno

  // Cargar pilotos
  useEffect(() => {
    let cancelled = false;
    const fetchDrivers = async () => {
      try {
        setLoadingDrivers(true);
        const response = await getAllDrivers();
        if (!cancelled) setAllDrivers(response);
      } catch (err) {
        if (!cancelled) setDriversError(`Error cargando pilotos: ${err.message}`);
      } finally {
        if (!cancelled) setLoadingDrivers(false);
      }
    };
    fetchDrivers();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  // Cargar prode existente (si lo hay)
  useEffect(() => {
    if (!userId || !sessionId) return;
    let cancelled = false;
    const fetchExisting = async () => {
      try {
        const prode = await getProdeByUserAndSession(
          parseInt(userId, 10),
          sessionId
        );
        if (cancelled) return;
        if (prode) {
          setExistingProde(prode);
          // Mapear al formData: asumimos keys p1..p5 lowercase en el backend
          setFormData({
            P1: prode.p1 ?? null,
            P2: prode.p2 ?? null,
            P3: prode.p3 ?? null,
            P4: prode.p4 ?? null,
            P5: prode.p5 ?? null,
            vsc: !!prode.vsc,
            sf: !!prode.sf,
            dnf: typeof prode.dnf === "number" ? prode.dnf : 0,
          });
        }
      } catch (err) {
        // no rompe la página si falla, pero podés opcionalmente loguear
        console.warn("No se pudo traer prode existente:", err);
      }
    };
    fetchExisting();
    return () => {
      cancelled = true;
    };
  }, [userId, sessionId]);

  // Warning modal si quedan <5 minutos
  useEffect(() => {
    if (!sessionStartDate) return;
    const check = () => {
      const now = new Date();
      const sessionStart = new Date(sessionStartDate);
      const diff = sessionStart - now;
      const fiveMinutes = 5 * 60 * 1000;
      if (diff <= fiveMinutes && diff > 0) {
        setShowWarningModal(true);
      }
    };
    check();
    const interval = setInterval(check, 30 * 1000);
    return () => clearInterval(interval);
  }, [sessionStartDate]);

  // Handlers
  const handleDriverChange = useCallback((position, value) => {
    setFormData((prev) => ({ ...prev, [position]: value }));
  }, []);

  const handleToggle = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleDnfChange = useCallback((value) => {
    setFormData((prev) => ({ ...prev, dnf: value }));
  }, []);

  const isFormComplete = useMemo(() => {
    return (
      formData.P1 &&
      formData.P2 &&
      formData.P3 &&
      formData.P4 &&
      formData.P5 &&
      typeof formData.dnf === "number" &&
      formData.dnf >= 0
    );
  }, [formData]);

  // Filtrar pilotos para cada posición (sin repetir)
  const driversFor = useMemo(() => {
    const { P1, P2, P3, P4, P5 } = formData;
    return {
      P1: allDrivers.filter((d) => d.id !== P2 && d.id !== P3 && d.id !== P4 && d.id !== P5),
      P2: allDrivers.filter((d) => d.id !== P1 && d.id !== P3 && d.id !== P4 && d.id !== P5),
      P3: allDrivers.filter((d) => d.id !== P1 && d.id !== P2 && d.id !== P4 && d.id !== P5),
      P4: allDrivers.filter((d) => d.id !== P1 && d.id !== P2 && d.id !== P3 && d.id !== P5),
      P5: allDrivers.filter((d) => d.id !== P1 && d.id !== P2 && d.id !== P3 && d.id !== P4),
    };
  }, [allDrivers, formData]);

  // Submit (create o update)
  const submit = useCallback(
    async (e) => {
      if (e && e.preventDefault) e.preventDefault();
      if (!isFormComplete) return;

      setSubmitting(true);
      try {
        const payload = {
          session_id: sessionId,
          p1: formData.P1,
          p2: formData.P2,
          p3: formData.P3,
          p4: formData.P4,
          p5: formData.P5,
          vsc: formData.vsc,
          sf: formData.sf,
          dnf: formData.dnf,
        };
        await createProdeCarrera(userId, payload);
        if (onSuccess) onSuccess();
      } catch (err) {
        if (onError) onError(err);
      } finally {
        setSubmitting(false);
      }
    },
    [formData, isFormComplete, sessionId, userId, onSuccess, onError]
  );

  const closeWarningModal = useCallback(() => setShowWarningModal(false), []);

  return {
    allDrivers,
    loadingDrivers,
    driversError,
    formData,
    driversFor,
    handleDriverChange,
    handleToggle,
    handleDnfChange,
    isFormComplete,
    showWarningModal,
    closeWarningModal,
    submit,
    submitting,
    existingProde, // si existía antes
  };
}
