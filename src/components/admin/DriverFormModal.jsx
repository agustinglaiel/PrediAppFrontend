// src/components/admin/DriverFormModal.jsx
import React, { useState, useEffect } from "react";

const DriverFormModal = ({ isOpen, onClose, onSubmit, driver = null }) => {
  const isEditing = !!driver; // Si driver existe, estamos editando

  const [formData, setFormData] = useState({
    broadcast_name: "",
    country_code: "",
    driver_number: "",
    first_name: "",
    last_name: "",
    full_name: "",
    name_acronym: "",
    headshot_url: "",
    team_name: "",
    activo: true,
  });
  const [error, setError] = useState(null);

  // Cargar los datos del piloto si estamos editando
  useEffect(() => {
    if (isEditing && driver) {
      setFormData({
        broadcast_name: driver.broadcast_name || "",
        country_code: driver.country_code || "",
        driver_number: driver.driver_number?.toString() || "", // Convertimos a string para el input
        first_name: driver.first_name || "",
        last_name: driver.last_name || "",
        full_name: driver.full_name || "",
        name_acronym: driver.name_acronym || "",
        headshot_url: driver.headshot_url || "",
        team_name: driver.team_name || "",
        activo: driver.activo ?? true,
      });
    }
  }, [isEditing, driver]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validación básica
    if (
      !formData.broadcast_name ||
      !formData.team_name ||
      !formData.driver_number
    ) {
      setError("Todos los campos obligatorios deben estar completos.");
      return;
    }

    // Preparar los datos para enviar
    const driverData = {
      broadcast_name: formData.broadcast_name,
      country_code: formData.country_code,
      driver_number: parseInt(formData.driver_number, 10),
      first_name: formData.first_name,
      last_name: formData.last_name,
      full_name: formData.full_name,
      name_acronym: formData.name_acronym,
      headshot_url: formData.headshot_url,
      team_name: formData.team_name,
      activo: formData.activo,
    };

    // Si estamos editando, eliminamos campos vacíos para cumplir con UpdateDriverDTO
    if (isEditing) {
      Object.keys(driverData).forEach((key) => {
        if (
          driverData[key] === "" ||
          driverData[key] === null ||
          (key === "driver_number" && isNaN(driverData[key]))
        ) {
          delete driverData[key];
        }
      });
    }
    onSubmit(driverData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {isEditing ? "Editar Piloto" : "Añadir Nuevo Piloto"}
        </h2>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Broadcast Name
            </label>
            <input
              type="text"
              name="broadcast_name"
              value={formData.broadcast_name}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Country Code
            </label>
            <input
              type="text"
              name="country_code"
              value={formData.country_code}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Driver Number
            </label>
            <input
              type="number"
              name="driver_number"
              value={formData.driver_number}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Name Acronym
            </label>
            <input
              type="text"
              name="name_acronym"
              value={formData.name_acronym}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Headshot URL
            </label>
            <input
              type="text"
              name="headshot_url"
              value={formData.headshot_url}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Team Name
            </label>
            <input
              type="text"
              name="team_name"
              value={formData.team_name}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Activo
            </label>
            <input
              type="checkbox"
              name="activo"
              checked={formData.activo}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              {isEditing ? "Actualizar" : "Aceptar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DriverFormModal;
