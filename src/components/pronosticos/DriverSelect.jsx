// DriverSelect.jsx
import React, { useState, useRef, useEffect } from "react";

const DriverSelect = ({
  position,
  value,
  onChange,
  disabled,
  drivers = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const selectRef = useRef(null);
  const searchInputRef = useRef(null);

  const selectedDriver = drivers.find((driver) => driver.id === value);

  const filteredDrivers = drivers.filter((driver) =>
    driver.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (driver) => {
    onChange(driver.id);
    setIsOpen(false);
    setSearchTerm("");
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setSearchTerm("");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  return (
    <div className="mb-3" ref={selectRef}>
      {/* Compact label row */}
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide min-w-[24px]">
          {position}
        </span>
        {selectedDriver ? (
          <span className="text-sm font-medium text-gray-900">
            {selectedDriver.full_name}
          </span>
        ) : (
          <span className="text-sm text-gray-400">Seleccionar piloto</span>
        )}
      </div>

      {/* Select trigger */}
      <div className="relative">
        <button
          type="button"
          onClick={toggleDropdown}
          disabled={disabled}
          className={`
            w-full border rounded-lg px-3 py-2.5 text-left text-sm transition-all duration-150
            ${disabled ? "bg-gray-50 cursor-not-allowed opacity-50" : "cursor-pointer hover:border-gray-400"}
            ${isOpen ? "border-red-500 ring-1 ring-red-500" : "border-gray-200"}
            ${selectedDriver ? "bg-white border-green-300" : "bg-white"}
          `}
        >
          <div className="flex items-center justify-between">
            <span className={selectedDriver ? "text-gray-900" : "text-gray-400"}>
              {selectedDriver ? selectedDriver.full_name : "Elegí un piloto"}
            </span>
            <div className="flex items-center gap-1.5">
              {selectedDriver && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(null);
                  }}
                  disabled={disabled}
                  className="p-0.5 hover:bg-red-50 rounded-full transition-colors"
                >
                  <svg className="w-3.5 h-3.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-hidden">
            {/* Search */}
            <div className="p-2 border-b border-gray-100">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {/* Options */}
            <div className="max-h-44 overflow-y-auto">
              {filteredDrivers.length === 0 ? (
                <div className="px-3 py-2 text-gray-400 text-center text-sm">
                  Sin resultados
                </div>
              ) : (
                filteredDrivers.map((driver) => (
                  <button
                    key={driver.id}
                    type="button"
                    onClick={() => handleSelect(driver)}
                    className={`
                      w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center justify-between
                      ${value === driver.id ? "bg-red-50 text-red-700 font-medium" : "text-gray-800"}
                    `}
                  >
                    <span>{driver.full_name}</span>
                    {value === driver.id && (
                      <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverSelect;