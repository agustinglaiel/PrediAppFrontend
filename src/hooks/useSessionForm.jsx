// para editar sesiones en admin sessions
import { useState, useEffect } from "react";

const SESSION_NAME_TO_TYPE = {
  "Practice 1": "Practice",
  "Practice 2": "Practice",
  "Practice 3": "Practice",
  Qualifying: "Qualifying",
  "Sprint Qualifying": "Qualifying",
  Sprint: "Race",
  Race: "Race",
  Test: "Testing",
};

const useSessionForm = (initialSession = {}, isEditing = false) => {
  const isRaceType = (name) => name === "Race" || name === "Sprint";

  const [formData, setFormData] = useState({
    weekend_id: initialSession?.weekend_id || "",
    circuit_short_name: initialSession?.circuit_short_name || "",
    country_code: initialSession?.country_code || "",
    country_name: initialSession?.country_name || "",
    location: initialSession?.location || "",
    session_name: initialSession?.session_name || "",
    session_type: initialSession?.session_type || "",
    date_start: initialSession?.date_start || "",
    date_end: initialSession?.date_end || "",
    year: initialSession?.year || "",
    // session_meta fields
    vsc: initialSession?.vsc ?? "",
    sf: initialSession?.sf ?? "",
    dnf: initialSession?.dnf ?? "",
  });

  const [showMeta, setShowMeta] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialSession?.date_start) {
      setFormData((prev) => ({
        ...prev,
        date_start: initialSession.date_start.slice(0, 16),
      }));
    }
    if (initialSession?.date_end) {
      setFormData((prev) => ({
        ...prev,
        date_end: initialSession.date_end.slice(0, 16),
      }));
    }
    // Auto-expand meta if session already has meta data
    if (
      initialSession?.vsc != null ||
      initialSession?.sf != null ||
      initialSession?.dnf != null
    ) {
      setShowMeta(true);
    }
  }, [initialSession]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedFields = { [name]: value };

    if (name === "session_name") {
      updatedFields.session_type = SESSION_NAME_TO_TYPE[value] || "";
      // Clear meta if switching away from Race type
      if (!isRaceType(value)) {
        updatedFields.vsc = "";
        updatedFields.sf = "";
        updatedFields.dnf = "";
        setShowMeta(false);
      }
    }

    setFormData((prev) => ({ ...prev, ...updatedFields }));

    // Clear error for the field being edited
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const toggleMeta = () => {
    if (showMeta) {
      // Closing: clear meta fields
      setFormData((prev) => ({ ...prev, vsc: "", sf: "", dnf: "" }));
    }
    setShowMeta((prev) => !prev);
  };

  const validate = () => {
    const newErrors = {};
    const required = [
      { key: "weekend_id", label: "Weekend ID" },
      { key: "circuit_short_name", label: "Nombre del Circuito" },
      { key: "country_code", label: "Código de País" },
      { key: "country_name", label: "Nombre del País" },
      { key: "location", label: "Ubicación" },
      { key: "date_start", label: "Fecha de Inicio" },
      { key: "date_end", label: "Fecha de Fin" },
      { key: "year", label: "Año" },
    ];

    if (!isEditing) {
      required.push({ key: "session_name", label: "Nombre de la Sesión" });
      required.push({ key: "session_type", label: "Tipo de Sesión" });
    }

    required.forEach(({ key, label }) => {
      if (!formData[key] && formData[key] !== 0) {
        newErrors[key] = `${label} es obligatorio`;
      }
    });

    // date_end must be after date_start
    if (formData.date_start && formData.date_end) {
      if (new Date(formData.date_end) <= new Date(formData.date_start)) {
        newErrors.date_end = "La fecha de fin debe ser posterior a la de inicio";
      }
    }

    // session_meta: all 3 or nothing
    if (showMeta && isRaceType(formData.session_name)) {
      const hasVsc = formData.vsc !== "" && formData.vsc != null;
      const hasSf = formData.sf !== "" && formData.sf != null;
      const hasDnf = formData.dnf !== "" && formData.dnf != null;
      const filled = [hasVsc, hasSf, hasDnf].filter(Boolean).length;

      if (filled > 0 && filled < 3) {
        if (!hasVsc) newErrors.vsc = "Obligatorio si se completa Session Meta";
        if (!hasSf) newErrors.sf = "Obligatorio si se completa Session Meta";
        if (!hasDnf) newErrors.dnf = "Obligatorio si se completa Session Meta";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildSubmitData = () => {
    const baseData = {
      weekend_id: formData.weekend_id
        ? parseInt(formData.weekend_id, 10)
        : null,
      circuit_short_name: formData.circuit_short_name || null,
      country_code: formData.country_code || null,
      country_name: formData.country_name || null,
      location: formData.location || null,
      date_start: formData.date_start
        ? new Date(formData.date_start).toISOString()
        : null,
      date_end: formData.date_end
        ? new Date(formData.date_end).toISOString()
        : null,
      year: formData.year ? parseInt(formData.year, 10) : null,
    };

    // Only include session_name and session_type for create (not update)
    if (!isEditing) {
      baseData.session_name = formData.session_name || null;
      baseData.session_type = formData.session_type || null;
    }

    // session_meta — only for Race sessions (Race or Sprint)
    if (isRaceType(formData.session_name) && showMeta) {
      const hasVsc = formData.vsc !== "" && formData.vsc != null;
      const hasSf = formData.sf !== "" && formData.sf != null;
      const hasDnf = formData.dnf !== "" && formData.dnf != null;

      if (hasVsc && hasSf && hasDnf) {
        baseData.session_meta = {
          vsc: formData.vsc === "true" || formData.vsc === true,
          sc: formData.sf === "true" || formData.sf === true,
          dnf: parseInt(formData.dnf, 10),
        };
      }
    }

    return baseData;
  };

  return {
    formData,
    handleChange,
    buildSubmitData,
    setFormData,
    validate,
    errors,
    showMeta,
    toggleMeta,
    isRaceSession: isRaceType(formData.session_name),
  };
};

export default useSessionForm;
