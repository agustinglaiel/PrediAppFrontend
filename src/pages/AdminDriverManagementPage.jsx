// src/pages/AdminDriverManagementPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import NavigationBar from "../components/NavigationBar";
import DriverDisplay from "../components/admin/DriverDisplay";
import DriverFormModal from "../components/admin/DriverFormModal";
import {
  getAllDrivers,
  createDriver,
  updateDriver,
} from "../api/drivers";

const AdminDriverManagementPage = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null); // Para manejar el piloto en edición
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        setLoading(true);
        const data = await getAllDrivers();
        setDrivers(data ?? []);
      } catch (err) {
        setError(err.message || "Error al cargar los pilotos.");
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  const handleCreateDriver = async (driverData) => {
    try {
      setLoading(true);
      const newDriver = await createDriver(driverData);
      setDrivers((prev) => [...prev, newDriver]);
      setError(null);
    } catch (err) {
      console.error("Error al crear piloto - Detalle:", err);
      setError(err.message || "Error al crear el piloto. Verifica los datos.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDriver = async (driverData) => {
    try {
      setLoading(true);
      const updatedDriver = await updateDriver(selectedDriver.id, driverData);
      setDrivers((prev) =>
        prev.map((driver) =>
          driver.id === updatedDriver.id ? updatedDriver : driver
        )
      );
      setError(null);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Error al actualizar el piloto. Verifica los datos.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditDriver = (driver) => {
    setSelectedDriver(driver);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedDriver(null);
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  // Filtrar pilotos activos e inactivos
  const activeDrivers = Array.isArray(drivers)
    ? drivers.filter((d) => (d.active ?? d.activo ?? true) === true)
    : [];
  const inactiveDrivers = Array.isArray(drivers)
    ? drivers.filter((d) => (d.active ?? d.activo ?? true) === false)
    : [];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow pt-24 px-4">
        <h1 className="text-3xl font-bold mb-4 ml-3">Gestión de Pilotos</h1>
        <div className="flex gap-4 mb-4 ml-3">
          <button
            onClick={() => {
              setSelectedDriver(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Añadir Piloto
          </button>
        </div>
        <div className="px-4 mt-12">
          <h2 className="text-2xl font-bold mb-4">Lista de Pilotos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {activeDrivers.map((driver) => (
              <DriverDisplay
                key={driver.id}
                driver={driver}
                onEdit={handleEditDriver}
              />
            ))}
          </div>

          {inactiveDrivers.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-4">Pilotos Inactivos</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {inactiveDrivers.map((driver) => (
                  <DriverDisplay
                    key={driver.id}
                    driver={driver}
                    onEdit={handleEditDriver}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      {isModalOpen && (
        <DriverFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={selectedDriver ? handleUpdateDriver : handleCreateDriver}
          driver={selectedDriver}
        />
      )}
      <footer className="bg-gray-200 text-gray-700 text-center py-3 text-sm mt-4">
        <p>© 2026 PrediApp</p>
      </footer>
    </div>
  );
};

export default AdminDriverManagementPage;
