import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import NavigationBar from "../components/NavigationBar";
import DriverDisplay from "../components/admin/DriverDisplay";
import DriverCreate from "../components/admin/DriverCreate"; // Nuevo import
import { getAllDrivers, createDriver } from "../api/drivers";
import ProtectedRoute from "../components/ProtectedRoute";

const AdminDriverManagementPage = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        setLoading(true);
        const data = await getAllDrivers();
        setDrivers(data);
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
      console.log("Payload enviado a createDriver:", driverData); // Depuración
      const newDriver = await createDriver(driverData);
      setDrivers((prev) => [...prev, newDriver]); // Agregar el nuevo piloto a la lista
      setError(null); // Limpiar cualquier error previo
    } catch (err) {
      console.error("Error al crear piloto - Detalle:", err);
      setError(err.message || "Error al crear el piloto. Verifica los datos.");
      // Mostrar detalles del error si están disponibles
      if (err.response?.data) {
        console.log("Respuesta del backend:", err.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  // Filtrar pilotos activos e inactivos
  const activeDrivers = drivers.filter((driver) => driver.activo === true);
  const inactiveDrivers = drivers.filter((driver) => driver.activo === false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow pt-24 px-4">
        <h1 className="text-3xl font-bold mb-4 ml-3">Gestión de Pilotos</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mb-4 ml-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Añadir Piloto
        </button>
        <div className="px-4 mt-12">
          <h2 className="text-2xl font-bold mb-4">Lista de Pilotos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {activeDrivers.map((driver) => (
              <DriverDisplay key={driver.id} driver={driver} />
            ))}
          </div>

          {/* Sección para pilotos inactivos */}
          {inactiveDrivers.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-4">Pilotos Inactivos</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {inactiveDrivers.map((driver) => (
                  <DriverDisplay key={driver.id} driver={driver} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      {isModalOpen && (
        <DriverCreate
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateDriver}
        />
      )}
      <footer className="bg-gray-200 text-gray-700 text-center py-3 text-sm mt-4">
        <p>© 2025 PrediApp</p>
      </footer>
    </div>
  );
};

export default () => (
  <ProtectedRoute>
    <AdminDriverManagementPage />
  </ProtectedRoute>
);
