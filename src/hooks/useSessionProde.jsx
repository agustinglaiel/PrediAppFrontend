// src/hooks/useSessionProde.js
import { useState, useEffect, useMemo, useCallback } from "react";
import { getAllDrivers } from "../api/drivers";
import { createProdeSession, getProdeByUserAndSession } from "../api/prodes";

export default function useSessionProde({
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
  });

  const [showWarningModal, setShowWarningModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [existingProde, setExistingProde] = useState(null);

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
          setFormData({
            P1: prode.p1 ?? null,
            P2: prode.p2 ?? null,
            P3: prode.p3 ?? null,
          });
        }
      } catch (err) {
        console.warn("Error cargando prode existente session:", err);
      }
    };
    fetchExisting();
    return () => {
      cancelled = true;
    };
  }, [userId, sessionId]);

  // Warning <5 minutos
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

  const isFormComplete = useMemo(() => {
    return formData.P1 && formData.P2 && formData.P3;
  }, [formData]);

  // Filtrado sin repetir
  const driversFor = useMemo(() => {
    const { P1, P2, P3 } = formData;
    return {
      P1: allDrivers.filter((d) => d.id !== P2 && d.id !== P3),
      P2: allDrivers.filter((d) => d.id !== P1 && d.id !== P3),
      P3: allDrivers.filter((d) => d.id !== P1 && d.id !== P2),
    };
  }, [allDrivers, formData]);

  // Submit (create / upsert)
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
        };
        await createProdeSession(userId, payload);
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
    driversFor, // { P1: [...], P2: [...], P3: [...] }
    handleDriverChange,
    isFormComplete,
    showWarningModal,
    closeWarningModal,
    submit,
    submitting,
    existingProde,
  };
}
