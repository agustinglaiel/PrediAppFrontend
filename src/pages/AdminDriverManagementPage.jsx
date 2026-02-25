// src/pages/AdminDriverManagementPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import Header from "../components/Header";
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
  const [selectedDriver, setSelectedDriver] = useState(null);
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

  const activeDrivers = Array.isArray(drivers)
    ? drivers.filter((d) => (d.active ?? d.activo ?? true) === true)
    : [];
  const inactiveDrivers = Array.isArray(drivers)
    ? drivers.filter((d) => (d.active ?? d.activo ?? true) === false)
    : [];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      {/* Floating "+" button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => {
            setSelectedDriver(null);
            setIsModalOpen(true);
          }}
          aria-label="Añadir piloto"
          className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:from-red-600 hover:to-red-700 active:scale-[0.97] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <FiPlus className="text-xl" />
        </button>
      </div>

      <main className="flex-grow pt-20 pb-24">
        {error && (
          <div className="max-w-6xl mx-auto px-4 mb-4">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
              <span>{error}</span>
            </div>
          </div>
        )}

        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Pilotos Activos</h2>
          <div className="space-y-3">
            {activeDrivers.map((driver) => (
              <DriverDisplay
                key={driver.id}
                driver={driver}
                onEdit={handleEditDriver}
              />
            ))}
          </div>

          {inactiveDrivers.length > 0 && (
            <div className="mt-10">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Pilotos Inactivos</h2>
              <div className="space-y-3">
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
    </div>
  );
};

export default AdminDriverManagementPage;
