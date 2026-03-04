import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../api/users";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const errorTimeoutRef = useRef(null);

  useEffect(() => {
    if (!error) return;

    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }

    errorTimeoutRef.current = setTimeout(() => {
      setError(null);
    }, 5000);

    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Error al enviar la solicitud.");
    } finally {
      setLoading(false);
    }
  };

  // Estado de éxito - mostrar mensaje de confirmación
  if (submitted) {
    return (
      <div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-2xl border border-gray-100">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            ¡Revisá tu email!
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Si existe una cuenta con ese email, recibirás un link para restablecer
            tu contraseña en breve.
          </p>
          <p className="text-xs text-gray-500 mb-6">
            No olvides revisar tu carpeta de spam.
          </p>
          <Link
            to="/login"
            className="text-red-600 hover:underline text-sm font-medium"
          >
            ← Volver al inicio de sesión
          </Link>
        </div>
      </div>
    );
  }

  // Formulario inicial
  return (
    <div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-2xl border border-gray-100">
      <div className="text-center mb-6">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <svg
            className="h-6 w-6 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-800">
          ¿Olvidaste tu contraseña?
        </h2>
        <p className="text-sm text-gray-600 mt-2">
          Ingresá tu email y te enviaremos un link para restablecerla.
        </p>
      </div>

      {error && (
        <p className="text-red-600 text-center mb-4 text-sm font-medium">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="block text-md font-medium text-black mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            placeholder="tu@email.com"
            required
            autoComplete="email"
            autoFocus
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white py-3 px-4 rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Enviando...
            </span>
          ) : (
            "Enviar link de recuperación"
          )}
        </button>
      </form>

      <p className="text-center mt-6 text-sm text-gray-600">
        <Link to="/login" className="text-red-600 hover:underline">
          ← Volver al inicio de sesión
        </Link>
      </p>
    </div>
  );
};

export default ForgotPasswordForm;
