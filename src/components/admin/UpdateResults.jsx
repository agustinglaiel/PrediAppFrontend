import React, { useState, useEffect, useRef } from "react";
import { FiX, FiSearch, FiChevronDown, FiCheck } from "react-icons/fi";
import { getResultsOrderedByPosition } from "../../api/results";

const TOTAL_POSITIONS = 22;

const STATUS_OPTIONS = [
  { value: "FINISHED", label: "FINISHED", color: "bg-green-500", bgLight: "bg-green-50 text-green-700 border-green-200" },
  { value: "DNF", label: "DNF", color: "bg-red-500", bgLight: "bg-red-50 text-red-700 border-red-200" },
  { value: "DNS", label: "DNS", color: "bg-yellow-500", bgLight: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  { value: "DSQ", label: "DSQ", color: "bg-purple-500", bgLight: "bg-purple-50 text-purple-700 border-purple-200" },
];

/* ─── Custom Driver Dropdown ─── */
const DriverDropdown = ({ value, onChange, drivers, selectedDriverIds, position }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);
  const inputRef = useRef(null);

  const selectedDriver = drivers.find((d) => d.id === value);

  const filtered = drivers.filter(
    (d) =>
      d.full_name.toLowerCase().includes(search.toLowerCase()) &&
      (!selectedDriverIds.includes(d.id) || d.id === value)
  );

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  return (
    <div ref={ref} className="relative flex-1 min-w-0">
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setSearch("");
        }}
        className={`
          w-full flex items-center gap-2 text-left text-sm py-2 px-3
          border rounded-lg transition-all duration-200 cursor-pointer
          ${isOpen ? "border-red-300 ring-2 ring-red-500/20" : "border-gray-200 hover:border-gray-300"}
          ${selectedDriver ? "bg-white" : "bg-gray-50"}
        `}
      >
        {selectedDriver ? (
          <>
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
              {selectedDriver.full_name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <span className="text-gray-800 font-medium truncate">
              {selectedDriver.full_name}
            </span>
          </>
        ) : (
          <span className="text-gray-400 truncate">Seleccionar piloto</span>
        )}
        <FiChevronDown
          className={`ml-auto text-gray-400 flex-shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Buscar piloto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Escape" && setIsOpen(false)}
                className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500/30"
              />
            </div>
          </div>
          {/* List */}
          <div className="max-h-48 overflow-y-auto">
            {/* Clear option */}
            {value && (
              <button
                type="button"
                onClick={() => {
                  onChange(null);
                  setIsOpen(false);
                  setSearch("");
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
              >
                <FiX className="text-xs" />
                <span>Quitar selección</span>
              </button>
            )}
            {filtered.length === 0 ? (
              <div className="px-3 py-4 text-center text-sm text-gray-400">
                No se encontraron pilotos
              </div>
            ) : (
              filtered.map((driver) => (
                <button
                  key={driver.id}
                  type="button"
                  onClick={() => {
                    onChange(driver.id);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className={`
                    w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors
                    ${driver.id === value ? "bg-red-50 text-red-700" : "hover:bg-gray-50 text-gray-700"}
                  `}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                      driver.id === value
                        ? "bg-gradient-to-br from-red-500 to-red-600 text-white"
                        : "bg-gradient-to-br from-gray-200 to-gray-300 text-gray-600"
                    }`}
                  >
                    {driver.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <span className="truncate font-medium">{driver.full_name}</span>
                  {driver.id === value && (
                    <FiCheck className="ml-auto text-red-500 flex-shrink-0" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Custom Status Dropdown ─── */
const StatusDropdown = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  const current = STATUS_OPTIONS.find((s) => s.value === value) || STATUS_OPTIONS[0];

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-1.5 text-xs font-semibold py-2 px-3
          border rounded-lg transition-all duration-200 cursor-pointer
          ${current.bgLight}
          ${isOpen ? "ring-2 ring-red-500/20" : ""}
        `}
      >
        <span className={`w-2 h-2 rounded-full ${current.color}`}></span>
        {current.label}
        <FiChevronDown
          className={`text-current opacity-60 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden min-w-[130px]">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`
                w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-left transition-colors
                ${opt.value === value ? "bg-gray-50" : "hover:bg-gray-50"}
              `}
            >
              <span className={`w-2 h-2 rounded-full ${opt.color}`}></span>
              <span className="text-gray-700">{opt.label}</span>
              {opt.value === value && (
                <FiCheck className="ml-auto text-red-500" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── Main Component ─── */
const UpdateResults = ({ session, drivers, onSave, onCancel }) => {
  const [results, setResults] = useState(
    Array.from({ length: TOTAL_POSITIONS }, (_, index) => ({
      position: index + 1,
      driver_id: null,
      status: "FINISHED",
    }))
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await getResultsOrderedByPosition(session.id);
        const existingResults = data.results || [];
        if (existingResults.length > 0) {
          const formattedResults = Array.from(
            { length: TOTAL_POSITIONS },
            (_, index) => {
              const result = existingResults.find(
                (r) => r.position === index + 1
              );
              return {
                position: index + 1,
                driver_id: result ? result.driver.id : null,
                status: result ? result.status : "FINISHED",
              };
            }
          );
          setResults(formattedResults);
        }
      } catch (error) {
        console.error("Error fetching results for session:", error);
      }
    };

    fetchResults();
  }, [session.id]);

  const handleDriverChange = (position, driverId) => {
    setResults((prev) =>
      prev.map((r) => (r.position === position ? { ...r, driver_id: driverId } : r))
    );
  };

  const handleStatusChange = (position, status) => {
    setResults((prev) =>
      prev.map((r) => (r.position === position ? { ...r, status } : r))
    );
  };

  const handleSave = async () => {
    const validResults = results.filter((result) => result.driver_id !== null);
    if (validResults.length === 0) return;
    setSaving(true);
    try {
      await onSave(validResults);
    } finally {
      setSaving(false);
    }
  };

  const selectedDriverIds = results
    .filter((r) => r.driver_id !== null)
    .map((r) => r.driver_id);

  const assignedCount = selectedDriverIds.length;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {session.sessionName}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Completá las posiciones y estados de los pilotos
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <FiX className="text-gray-500 text-lg" />
          </button>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto px-2 py-3">
          <div className="space-y-1.5 px-2">
            {results.map((result) => {
              const posClass =
                result.position === 1
                  ? "bg-yellow-400 text-white"
                  : result.position === 2
                  ? "bg-gray-400 text-white"
                  : result.position === 3
                  ? "bg-amber-600 text-white"
                  : "bg-gray-100 text-gray-600";

              return (
                <div
                  key={result.position}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-gray-50 transition-colors"
                >
                  {/* Position badge */}
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${posClass}`}
                  >
                    P{result.position}
                  </div>

                  {/* Driver custom dropdown */}
                  <DriverDropdown
                    value={result.driver_id}
                    onChange={(driverId) =>
                      handleDriverChange(result.position, driverId)
                    }
                    drivers={drivers}
                    selectedDriverIds={selectedDriverIds}
                    position={result.position}
                  />

                  {/* Status custom dropdown */}
                  <StatusDropdown
                    value={result.status}
                    onChange={(status) =>
                      handleStatusChange(result.position, status)
                    }
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gradient-to-r from-white to-gray-50">
          <p className="text-xs text-gray-400">
            {assignedCount} de {TOTAL_POSITIONS} pilotos asignados
          </p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-[0.97]"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving || assignedCount === 0}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 shadow-sm active:scale-[0.97] ${
                saving || assignedCount === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-red-500/25 hover:shadow-red-500/40"
              }`}
            >
              {saving ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateResults;
