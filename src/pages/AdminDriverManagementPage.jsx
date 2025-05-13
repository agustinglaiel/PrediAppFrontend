import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import NavigationBar from "../components/NavigationBar";
import DriverDisplay from "../components/admin/DriverDisplay";
import { getAllDrivers } from "../api/drivers";
import ProtectedRoute from "../components/ProtectedRoute";

const AdminDriverManagementPage = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow pt-24 px-4">
        <h1 className="text-3xl font-bold mb-6">Gestión de Pilotos</h1>
        <div className="px-4 mt-12">
          <h2 className="text-2xl font-bold mb-4">Lista de Pilotos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {" "}
            {/* Ajustamos de md:grid-cols-3 a md:grid-cols-4 */}
            {drivers.map((driver) => (
              <DriverDisplay key={driver.id} driver={driver} />
            ))}
          </div>
        </div>
      </main>
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
