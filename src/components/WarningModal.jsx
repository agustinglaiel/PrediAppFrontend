// src/components/WarningModal.jsx
import React from "react";

const WarningModal = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm mx-4">
        <p className="text-gray-800 mb-6">{message}</p>
        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default WarningModal;
