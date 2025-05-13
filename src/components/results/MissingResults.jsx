import React from "react";
import { useNavigate } from "react-router-dom";

const MissingResults = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleAccept = () => {
    onClose();
    navigate("/resultados"); // Redirige a ResultsPage
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          Resultados no disponibles
        </h2>
        <p className="text-gray-600 mb-6">
          Espere un momento a que se carguen los resultados de la sesión.
        </p>
        <div className="flex justify-end">
          <button
            onClick={handleAccept}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default MissingResults;
