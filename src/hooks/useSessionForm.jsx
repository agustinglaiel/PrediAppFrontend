// para editar sesiones en admin sessions
import { useState, useEffect } from "react";

const useSessionForm = (initialSession = {}, isEditing = false) => {
  const [formData, setFormData] = useState({
    weekend_id: initialSession?.weekend_id || "",
    circuit_key: initialSession?.circuit_key || "",
    circuit_short_name: initialSession?.circuit_short_name || "",
    country_code: initialSession?.country_code || "",
    country_name: initialSession?.country_name || "",
    location: initialSession?.location || "",
    session_key: initialSession?.session_key || "",
    session_name: initialSession?.session_name || "",
    session_type: initialSession?.session_type || "",
    date_start: initialSession?.date_start || "",
    date_end: initialSession?.date_end || "",
    year: initialSession?.year || "",
    vsc: initialSession?.vsc ?? null,
    sf: initialSession?.sf ?? null,
    dnf: initialSession?.dnf ?? null,
  });

  useEffect(() => {
  if (initialSession?.date_start) {
    setFormData((prev) => ({
      ...prev,
      date_start: initialSession.date_start.slice(0, 16), // ya está en UTC
    }));
  }
  if (initialSession?.date_end) {
    setFormData((prev) => ({
      ...prev,
      date_end: initialSession.date_end.slice(0, 16),
    }));
  }
}, [initialSession]);


  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedFields = { [name]: value };

    // Autocompletar session_type cuando cambia session_name
    if (name === "session_name") {
      if (/^Practice\s?[1-3]$/.test(value)) {
        updatedFields.session_type = "Practice";
      } else if (value === "Qualifying" || value === "Sprint Qualifying") {
        updatedFields.session_type = "Qualifying";
      } else if (value === "Race" || value === "Sprint") {
        updatedFields.session_type = "Race";
      } else {
        updatedFields.session_type = "";
      }
    }

    setFormData((prev) => ({
      ...prev,
      ...updatedFields,
    }));
  };

  const buildSubmitData = () => {
    const baseData = {
      weekend_id: formData.weekend_id
        ? parseInt(formData.weekend_id, 10)
        : null,
      circuit_key: formData.circuit_key
        ? parseInt(formData.circuit_key, 10)
        : null,
      circuit_short_name: formData.circuit_short_name || null,
      country_code: formData.country_code || null,
      country_name: formData.country_name || null,
      location: formData.location || null,
      session_key: formData.session_key
        ? parseInt(formData.session_key, 10)
        : null,
      session_name: formData.session_name || null,
      session_type: formData.session_type || null,
      date_start: formData.date_start
        ? new Date(formData.date_start).toISOString()
        : null,
      date_end: formData.date_end
        ? new Date(formData.date_end).toISOString()
        : null,
      year: formData.year ? parseInt(formData.year, 10) : null,
    };

    if (isEditing && formData.session_type === "Race") {
      baseData.vsc =
        formData.vsc === "true"
          ? true
          : formData.vsc === "false"
          ? false
          : null;
      baseData.sf =
        formData.sf === "true"
          ? true
          : formData.sf === "false"
          ? false
          : null;
      baseData.dnf = formData.dnf ? parseInt(formData.dnf, 10) : null;
    }

    return baseData;
  };

  return {
    formData,
    handleChange,
    buildSubmitData,
    setFormData,
  };
};

export default useSessionForm;
