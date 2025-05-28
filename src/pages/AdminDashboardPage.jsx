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
        <div className="mt-6 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 justify-items-center">
          <div className="w-full">
            <a
              href="/admin/users"
              className="block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-center w-full"
            >
              Gestionar Usuarios
            </a>
          </div>
          <div className="w-full">
            <a
              href="/admin/sessions"
              className="block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-center w-full"
            >
              Gestionar Sesiones
            </a>
          </div>
          <div className="w-full">
            <a
              href="/admin/results"
              className="block px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 text-center w-full"
            >
              Gestionar Resultados
            </a>
          </div>
          <div className="w-full">
            <a
              href="/admin/drivers"
              className="block px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-center w-full"
            >
              Gestionar Pilotos
            </a>
          </div>
          <div className="w-full">
            <a
              href="/admin/prodes"
              className="block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-center w-full"
            >
              Gestionar Pronósticos
            </a>
          </div>
        </div>
      </main>
      <footer className="bg-gray-200 text-gray-700 text-center py-3 text-sm">
        <p>© 2025 PrediApp</p>
      </footer>
    </div>
  );
};

export default AdminDashboardPage;
