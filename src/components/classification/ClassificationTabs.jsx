import React from "react";

const ClassificationTabs = ({ activeTab, onChange }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 mb-6">
      <div className="relative bg-gradient-to-br from-white to-gray-50 backdrop-blur-sm border border-white/20 shadow-xl rounded-xl p-1.5 overflow-hidden max-w-md mx-auto">
        <div
          className={`absolute top-1.5 bottom-1.5 bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow-lg transition-all duration-300 ease-in-out ${
            activeTab === "drivers"
              ? "left-1.5 right-1/2 mr-0.75"
              : "left-1/2 right-1.5 ml-0.75"
          }`}
        />

        <div className="relative flex">
          <button
            onClick={() => onChange("drivers")}
            className={`relative flex-1 py-2.5 px-4 text-center font-semibold text-sm transition-all duration-300 ease-in-out rounded-lg ${
              activeTab === "drivers"
                ? "text-white"
                : "text-gray-700 hover:text-red-600"
            }`}
          >
            <span className="relative z-10">Pilotos</span>
          </button>

          <button
            onClick={() => onChange("constructors")}
            className={`relative flex-1 py-2.5 px-4 text-center font-semibold text-sm transition-all duration-300 ease-in-out rounded-lg ${
              activeTab === "constructors"
                ? "text-white"
                : "text-gray-700 hover:text-red-600"
            }`}
          >
            <span className="relative z-10">Constructores</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassificationTabs;
