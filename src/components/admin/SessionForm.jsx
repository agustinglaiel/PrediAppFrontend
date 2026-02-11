import React from "react";
import { IoChevronDown } from "react-icons/io5";
import useSessionForm from "../../hooks/useSessionForm";

const SessionForm = ({ session, onSubmit, onCancel, isEditing = false }) => {
  const {
    formData,
    handleChange,
    buildSubmitData,
    validate,
    errors,
    showMeta,
    toggleMeta,
    isRaceSession,
  } = useSessionForm(session, isEditing);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const submitData = buildSubmitData();
    onSubmit(submitData);
  };

  const inputClass = (field) =>
    `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors ${
      errors[field]
        ? "border-red-400 focus:ring-red-400/40 bg-red-50"
        : "border-gray-200 focus:ring-red-400/40 focus:border-red-400 bg-white"
    }`;

  const labelClass = "block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider";

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-lg font-bold text-gray-800 mb-5">
        {isEditing ? "Editar Sesión" : "Nueva Sesión"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Weekend ID & Year */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>
              Weekend ID <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              name="weekend_id"
              value={formData.weekend_id}
              onChange={handleChange}
              className={inputClass("weekend_id")}
              placeholder="Ej: 1"
            />
            {errors.weekend_id && (
              <p className="text-xs text-red-500 mt-0.5">{errors.weekend_id}</p>
            )}
          </div>
          <div>
            <label className={labelClass}>
              Año <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className={inputClass("year")}
              placeholder="2026"
            />
            {errors.year && (
              <p className="text-xs text-red-500 mt-0.5">{errors.year}</p>
            )}
          </div>
        </div>

        {/* Circuit & Location */}
        <div>
          <label className={labelClass}>
            Nombre del Circuito <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            name="circuit_short_name"
            value={formData.circuit_short_name}
            onChange={handleChange}
            className={inputClass("circuit_short_name")}
            placeholder="Ej: Monza"
          />
          {errors.circuit_short_name && (
            <p className="text-xs text-red-500 mt-0.5">{errors.circuit_short_name}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>
              Código de País <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="country_code"
              value={formData.country_code}
              onChange={handleChange}
              className={inputClass("country_code")}
              placeholder="ITA"
            />
            {errors.country_code && (
              <p className="text-xs text-red-500 mt-0.5">{errors.country_code}</p>
            )}
          </div>
          <div>
            <label className={labelClass}>
              Nombre del País <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="country_name"
              value={formData.country_name}
              onChange={handleChange}
              className={inputClass("country_name")}
              placeholder="Italy"
            />
            {errors.country_name && (
              <p className="text-xs text-red-500 mt-0.5">{errors.country_name}</p>
            )}
          </div>
        </div>

        <div>
          <label className={labelClass}>
            Ubicación <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className={inputClass("location")}
            placeholder="Monza"
          />
          {errors.location && (
            <p className="text-xs text-red-500 mt-0.5">{errors.location}</p>
          )}
        </div>

        {/* Session Name & Type */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>
              Nombre de la Sesión <span className="text-red-400">*</span>
            </label>
            <select
              name="session_name"
              value={formData.session_name}
              onChange={handleChange}
              disabled={isEditing}
              className={`${inputClass("session_name")} ${isEditing ? "cursor-not-allowed bg-gray-50 text-gray-400" : ""}`}
            >
              <option value="">Seleccionar...</option>
              <option value="Practice 1">Practice 1</option>
              <option value="Practice 2">Practice 2</option>
              <option value="Practice 3">Practice 3</option>
              <option value="Qualifying">Qualifying</option>
              <option value="Sprint Qualifying">Sprint Qualifying</option>
              <option value="Sprint">Sprint</option>
              <option value="Race">Race</option>
              <option value="Test">Test</option>
            </select>
            {errors.session_name && (
              <p className="text-xs text-red-500 mt-0.5">{errors.session_name}</p>
            )}
          </div>
          <div>
            <label className={labelClass}>Tipo de Sesión</label>
            <input
              type="text"
              name="session_type"
              value={formData.session_type}
              readOnly
              className="w-full px-3 py-2 border border-gray-100 rounded-lg text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>
              Fecha de Inicio <span className="text-red-400">*</span>
            </label>
            <input
              type="datetime-local"
              name="date_start"
              value={formData.date_start}
              onChange={handleChange}
              className={inputClass("date_start")}
            />
            {errors.date_start && (
              <p className="text-xs text-red-500 mt-0.5">{errors.date_start}</p>
            )}
          </div>
          <div>
            <label className={labelClass}>
              Fecha de Fin <span className="text-red-400">*</span>
            </label>
            <input
              type="datetime-local"
              name="date_end"
              value={formData.date_end}
              onChange={handleChange}
              className={inputClass("date_end")}
            />
            {errors.date_end && (
              <p className="text-xs text-red-500 mt-0.5">{errors.date_end}</p>
            )}
          </div>
        </div>

        {/* Session Meta — collapsible, only for Race sessions */}
        {isRaceSession && (
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={toggleMeta}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <span className="text-sm font-medium text-gray-700">
                Información de Carrera
              </span>
              <IoChevronDown
                className={`text-gray-400 transition-transform duration-200 ${
                  showMeta ? "rotate-180" : ""
                }`}
              />
            </button>

            {showMeta && (
              <div className="p-4 space-y-3 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>VSC</label>
                    <select
                      name="vsc"
                      value={
                        formData.vsc === true
                          ? "true"
                          : formData.vsc === false
                          ? "false"
                          : formData.vsc || ""
                      }
                      onChange={handleChange}
                      className={inputClass("vsc")}
                    >
                      <option value="">Seleccionar</option>
                      <option value="true">Sí</option>
                      <option value="false">No</option>
                    </select>
                    {errors.vsc && (
                      <p className="text-xs text-red-500 mt-0.5">{errors.vsc}</p>
                    )}
                  </div>
                  <div>
                    <label className={labelClass}>Safety Car</label>
                    <select
                      name="sf"
                      value={
                        formData.sf === true
                          ? "true"
                          : formData.sf === false
                          ? "false"
                          : formData.sf || ""
                      }
                      onChange={handleChange}
                      className={inputClass("sf")}
                    >
                      <option value="">Seleccionar</option>
                      <option value="true">Sí</option>
                      <option value="false">No</option>
                    </select>
                    {errors.sf && (
                      <p className="text-xs text-red-500 mt-0.5">{errors.sf}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className={labelClass}>DNF (Did Not Finish)</label>
                  <input
                    type="number"
                    name="dnf"
                    value={formData.dnf ?? ""}
                    onChange={handleChange}
                    className={inputClass("dnf")}
                    placeholder="Número de DNFs"
                    min="0"
                  />
                  {errors.dnf && (
                    <p className="text-xs text-red-500 mt-0.5">{errors.dnf}</p>
                  )}
                </div>
                <p className="text-xs text-gray-400 italic">
                  Deben completarse los 3 campos o ninguno.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-sm text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg hover:from-red-600 hover:to-red-700 shadow-sm shadow-red-500/20 transition-all"
          >
            {isEditing ? "Guardar cambios" : "Crear sesión"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SessionForm;