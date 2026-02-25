import React, { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiCheck } from "react-icons/fi";

const YearSelector = ({ selectedYear, years, onChange, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (year) => {
    onChange(year);
    setIsOpen(false);
  };

  return (
    <div ref={ref} className="relative inline-block min-w-[120px]">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between gap-3
          bg-white border border-gray-200 shadow-sm
          rounded-xl py-2.5 pl-4 pr-3
          text-sm font-semibold text-gray-700
          cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-300
          transition-all duration-200
          hover:border-red-300 hover:shadow-md
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${isOpen ? "ring-2 ring-red-500/30 border-red-300 shadow-md" : ""}
        `}
      >
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
          {selectedYear}
        </span>
        <FiChevronDown
          className={`text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="max-h-60 overflow-y-auto py-1">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => handleSelect(year)}
                className={`
                  w-full flex items-center justify-between px-4 py-2.5
                  text-sm font-medium transition-colors duration-150
                  ${
                    year === selectedYear
                      ? "bg-red-50 text-red-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }
                `}
              >
                <span>{year}</span>
                {year === selectedYear && (
                  <FiCheck className="text-red-500 text-base" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default YearSelector;
