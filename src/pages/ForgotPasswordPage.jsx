import React from "react";
import Header from "../components/Header";
import ForgotPasswordForm from "../components/ForgotPasswordForm";

const ForgotPasswordPage = () => {
  return (
    <div className="relative w-full h-screen bg-white overflow-hidden">
      <div className="absolute inset-0 flex flex-col">
        <Header />

        <main className="flex-grow flex justify-center items-center z-10">
          <ForgotPasswordForm />
        </main>

        <footer className="bg-gray-200 text-gray-700 text-center py-3 text-sm">
          <p>© 2026 PrediApp</p>
        </footer>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
