// YesNoButton.jsx
import React from "react";

export default function YesNoButton({
  label,
  value,
  onChange,
  disabled = false,
}) {
  const handleYes = () => {
    if (!disabled && onChange) onChange(true);
  };

  const handleNo = () => {
    if (!disabled && onChange) onChange(false);
  };

  return (
    <div className="flex flex-col items-center gap-1.5">
      {label && (
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
          {label}
        </label>
      )}
      <div className="inline-flex rounded-lg overflow-hidden border border-gray-200">
        <button
          type="button"
          className={`px-4 py-1.5 text-sm font-medium transition-all duration-150 ${
            value === true
              ? "bg-red-500 text-white"
              : "bg-white text-gray-600 hover:bg-gray-50"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={handleYes}
        >
          Si
        </button>
        <button
          type="button"
          className={`px-4 py-1.5 text-sm font-medium transition-all duration-150 border-l border-gray-200 ${
            value === false
              ? "bg-gray-700 text-white"
              : "bg-white text-gray-600 hover:bg-gray-50"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={handleNo}
        >
          No
        </button>
      </div>
    </div>
  );
}
