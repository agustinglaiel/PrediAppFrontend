// src/pages/LoginPage.jsx
import React from "react";
import Header from "../components/Header";
import LoginForm from "../components/LoginForm";
import Hyperspeed from "../components/Hyperspeed";
import Threads from "../components/Threads";


const LoginPage = () => {
  return (
    <div className="relative w-full h-screen bg-white overflow-hidden">
      {/* Contenido superpuesto */}
      <div className="absolute inset-0 flex flex-col">
        <Header />

        <main className="flex-grow flex justify-center items-center z-10">
          {/* Ya no hay div blanco alrededor */}
          <LoginForm />
        </main>

        <footer className="bg-gray-200 text-gray-700 text-center py-3 text-sm">
          <p>© 2025 PrediApp</p>
        </footer>
      </div>
    </div>
  );
};

export default LoginPage;
