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

  // Encontrar el piloto seleccionado
  const selectedDriver = drivers.find(driver => driver.id === value);
  
  // Filtrar pilotos por término de búsqueda
  const filteredDrivers = drivers.filter(driver =>
    driver.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Cerrar dropdown cuando se hace click fuera
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

  // Focus en el input cuando se abre
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
    if (event.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  const getPositionColor = (pos) => {
    switch (pos) {
      case 'P1':
        return 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900';
      case 'P2':
        return 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-900';
      case 'P3':
        return 'bg-gradient-to-r from-amber-600 to-amber-700 text-white';
      default:
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
    }
  };

  return (
    <div className="mb-6 ml-4" ref={selectRef}>
      {/* Label con badge de posición */}
      <div className="flex items-center gap-3 mb-2">
        <span className={`px-3 py-1 rounded-full text-sm font-bold shadow-md ${getPositionColor(position)}`}>
          {position}
        </span>
        <label className="text-sm font-semibold text-gray-800">
          Seleccionar piloto para {position}
        </label>
      </div>

      {/* Custom Select Container */}
      <div className="relative">
        {/* Select Button */}
        <button
          type="button"
          onClick={toggleDropdown}
          disabled={disabled}
          className={`
            relative w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-left shadow-md
            transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'cursor-pointer hover:border-gray-300'}
            ${isOpen ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-20' : ''}
            ${selectedDriver ? 'bg-gradient-to-r from-green-50 to-blue-50 border-green-200' : ''}
          `}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {selectedDriver ? (
                <>
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-300 rounded-full flex items-center justify-center text-gray-700 font-bold text-sm">
                    {selectedDriver.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-900 font-semibold">
                      {selectedDriver.full_name}
                    </span>
                    <span className="text-xs text-gray-500">
                      Piloto seleccionado para {position}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="text-gray-500 font-medium">
                    Selecciona un piloto
                  </span>
                </>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {selectedDriver && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(null);
                  }}
                  disabled={disabled}
                  className="p-1 hover:bg-red-100 rounded-full transition-colors"
                >
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-64 overflow-hidden">
            {/* Search Input */}
            <div className="p-3 border-b border-gray-100 bg-gray-50">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Buscar piloto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>

            {/* Options List */}
            <div className="max-h-48 overflow-y-auto">
              {filteredDrivers.length === 0 ? (
                <div className="px-4 py-3 text-gray-500 text-center text-sm">
                  No se encontraron pilotos
                </div>
              ) : (
                filteredDrivers.map((driver) => (
                  <button
                    key={driver.id}
                    type="button"
                    onClick={() => handleSelect(driver)}
                    className={`
                      w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors duration-150 flex items-center space-x-3
                      ${value === driver.id ? 'bg-blue-100 border-r-4 border-blue-500' : ''}
                    `}
                  >
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2
                      ${value === driver.id 
                        ? 'bg-gradient-to-br from-green-100 to-green-200 border-green-400 text-green-700' 
                        : 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300 text-gray-700'}
                    `}>
                      {driver.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className={`font-medium ${value === driver.id ? 'text-blue-900' : 'text-gray-900'}`}>
                        {driver.full_name}
                      </span>
                      {value === driver.id && (
                        <span className="text-xs text-green-600 font-medium">
                          ✓ Seleccionado para {position}
                        </span>
                      )}
                    </div>
                    {value === driver.id && (
                      <div className="text-green-500">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
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