import React, { useState, useEffect } from "react";

const SessionForm = ({
  session: initialSession,
  onSubmit,
  onCancel,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState({
    weekend_id: initialSession?.weekend_id || "",
    circuit_key: initialSession?.circuit_key || "",
    circuit_short_name: initialSession?.circuit_short_name || "",
    country_code: initialSession?.country_code || "",
    country_name: initialSession?.country_name || "",
    location: initialSession?.location || "",
    session_name: initialSession?.session_name || "",
    session_type: initialSession?.session_type || "",
    date_start: initialSession?.date_start || "",
    date_end: initialSession?.date_end || "",
    year: initialSession?.year || "",
    d_fast_lap: initialSession?.d_fast_lap || null,
    vsc: initialSession?.vsc || null,
    sf: initialSession?.sf || null,
    dnf: initialSession?.dnf || null,
  });

  useEffect(() => {
    if (initialSession?.date_start) {
      setFormData((prev) => ({
        ...prev,
        date_start: new Date(initialSession.date_start)
          .toISOString()
          .slice(0, 16),
      }));
    }
    if (initialSession?.date_end) {
      setFormData((prev) => ({
        ...prev,
        date_end: new Date(initialSession.date_end).toISOString().slice(0, 16),
      }));
    }
  }, [initialSession]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Filtrar y formatear los datos según UpdateSessionDTO
    const submitData = {
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
      session_name: formData.session_name || null,
      session_type: formData.session_type || null,
      date_start: formData.date_start
        ? new Date(formData.date_start).toISOString()
        : null,
      date_end: formData.date_end
        ? new Date(formData.date_end).toISOString()
        : null,
      year: formData.year ? parseInt(formData.year, 10) : null,
      ...(isEditing && {
        d_fast_lap: formData.d_fast_lap
          ? parseInt(formData.d_fast_lap, 10)
          : null,
        vsc:
          formData.vsc === "true"
            ? true
            : formData.vsc === "false"
            ? false
            : null,
        sf:
          formData.sf === "true"
            ? true
            : formData.sf === "false"
            ? false
            : null,
        dnf: formData.dnf ? parseInt(formData.dnf, 10) : null,
      }),
    };
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Weekend ID
        </label>
        <input
          type="number"
          name="weekend_id"
          value={formData.weekend_id}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Circuit Key
        </label>
        <input
          type="number"
          name="circuit_key"
          value={formData.circuit_key}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Circuit Short Name
        </label>
        <input
          type="text"
          name="circuit_short_name"
          value={formData.circuit_short_name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Country Code
        </label>
        <input
          type="text"
          name="country_code"
          value={formData.country_code}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Country Name
        </label>
        <input
          type="text"
          name="country_name"
          value={formData.country_name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Location
        </label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Session Name
        </label>
        <input
          type="text"
          name="session_name"
          value={formData.session_name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Session Type
        </label>
        <select
          name="session_type"
          value={formData.session_type}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Selecciona un tipo</option>
          <option value="Practice">Practice</option>
          <option value="Qualifying">Qualifying</option>
          <option value="Race">Race</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Date Start
        </label>
        <input
          type="datetime-local"
          name="date_start"
          value={formData.date_start}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Date End
        </label>
        <input
          type="datetime-local"
          name="date_end"
          value={formData.date_end}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Year</label>
        <input
          type="number"
          name="year"
          value={formData.year}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      {isEditing && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              D Fast Lap
            </label>
            <input
              type="number"
              name="d_fast_lap"
              value={formData.d_fast_lap || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              VSC
            </label>
            <select
              name="vsc"
              value={formData.vsc || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Selecciona</option>
              <option value="true">Sí</option>
              <option value="false">No</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              SF (Safety Car)
            </label>
            <select
              name="sf"
              value={formData.sf || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Selecciona</option>
              <option value="true">Sí</option>
              <option value="false">No</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              DNF
            </label>
            <input
              type="number"
              name="dnf"
              value={formData.dnf || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </>
      )}
      <div className="flex space-x-2 pt-4">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {initialSession ? "Actualizar" : "Crear"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default SessionForm;
