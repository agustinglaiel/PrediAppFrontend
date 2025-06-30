// src/pages/ForoPage.jsx
import React from "react";
import Header from "../components/Header";
import NavigationBar from "../components/NavigationBar";

const ForoPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <NavigationBar />
      <main className="flex-grow pt-24 px-4">
        <h1 className="text-3xl font-bold mb-6">Foro</h1>
        <p className="text-gray-600">
          Contenido de la página de grupos vendrá aquí.
        </p>
      </main>
      <footer className="bg-gray-200 text-gray-700 text-center py-3 text-sm">
        <p>© 2025 PrediApp</p>
      </footer>
    </div>
  );
};

export default ForoPage;
