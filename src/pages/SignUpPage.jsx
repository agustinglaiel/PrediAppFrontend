import React from "react";
import SignUpForm from "../components/SignUpForm";
import Header from "../components/Header";

const SignupPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Opcional: si quieres que en Signup aparezca o no el Header global */}
      <Header />

      {/* main con flex-grow para que “empuje” al footer al fondo */}
      <main className="flex-grow flex justify-center items-center pt-20">
        <SignUpForm />
      </main>

      <footer className="bg-gray-200 text-gray-700 text-center py-3 text-sm">
        <p>© 2025 PrediApp</p>
      </footer>
    </div>
  );
};

export default SignupPage;
