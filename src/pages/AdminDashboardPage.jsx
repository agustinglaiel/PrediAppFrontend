import React from "react";
import Header from "../components/Header";
import NavigationBar from "../components/NavigationBar";

const AdminDashboardPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      {/* <NavigationBar /> */}
      <main className="flex-grow pt-24 px-4 text-center">
        <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>
        <p className="text-gray-600">
          Bienvenido al panel de administración. Aquí puedes gestionar usuarios,
          configurar eventos y más.
        </p>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 justify-items-center max-w-6xl mx-auto">
          <div className="w-full">
            <a
              href="/admin/users"
              className="block h-20 px-4 py-4 bg-white text-gray-700 border-2 border-gray-400 rounded-lg hover:bg-gray-50 hover:border-gray-500 text-center w-full flex items-center justify-center transition-colors duration-200"
            >
              Gestionar Usuarios
            </a>
          </div>
          <div className="w-full">
            <a
              href="/admin/sessions"
              className="block h-20 px-4 py-4 bg-white text-gray-700 border-2 border-gray-400 rounded-lg hover:bg-gray-50 hover:border-gray-500 text-center w-full flex items-center justify-center transition-colors duration-200"
            >
              Gestionar Sesiones
            </a>
          </div>
          <div className="w-full">
            <a
              href="/admin/results"
              className="block h-20 px-4 py-4 bg-white text-gray-700 border-2 border-gray-400 rounded-lg hover:bg-gray-50 hover:border-gray-500 text-center w-full flex items-center justify-center transition-colors duration-200"
            >
              Gestionar Resultados
            </a>
          </div>
          <div className="w-full">
            <a
              href="/admin/drivers"
              className="block h-20 px-4 py-4 bg-white text-gray-700 border-2 border-gray-400 rounded-lg hover:bg-gray-50 hover:border-gray-500 text-center w-full flex items-center justify-center transition-colors duration-200"
            >
              Gestionar Pilotos
            </a>
          </div>
          <div className="w-full">
            <a
              href="/admin/prodes"
              className="block h-20 px-4 py-4 bg-white text-gray-700 border-2 border-gray-400 rounded-lg hover:bg-gray-50 hover:border-gray-500 text-center w-full flex items-center justify-center transition-colors duration-200"
            >
              Gestionar Pronósticos
            </a>
          </div>
        </div>
      </main>
      <footer className="bg-gray-200 text-gray-700 text-center py-3 text-sm">
        <p>© 2026 PrediApp</p>
      </footer>
    </div>
  );
};

export default AdminDashboardPage;