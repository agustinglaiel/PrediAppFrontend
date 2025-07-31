// src/pages/LoginPage.jsx
import React from "react";
import Header from "../components/Header";
import LoginForm from "../components/LoginForm";
import Hyperspeed from "../components/Hyperspeed";
import Threads from "../components/Threads";


const LoginPage = () => {
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Fondo WebGL centrado */}
      <div className="absolute inset-0 flex justify-center items-center">
        {/* Si quieres que ocupe todo el ancho/alto, mantiene w-full h-full */}
        {/* si prefieres un tamaño fijo, cámbialo aquí: e.g. w-3/4 h-3/4 */}
        <Threads
          amplitude={3}
          distance={0}
          enableMouseInteraction={true}
        />
      </div>

      {/* Contenido superpuesto */}
      <div className="absolute inset-0 flex flex-col">
        <Header />

        <main className="flex-grow flex justify-center items-center z-10">
          {/* Ya no hay div blanco alrededor */}
          <LoginForm />
        </main>

        {/* <footer className="bg-gray-200 text-gray-700 text-center py-3 text-sm">
          <p>© 2025 PrediApp</p>
        </footer> */}
      </div>
    </div>
  );
};

export default LoginPage;
