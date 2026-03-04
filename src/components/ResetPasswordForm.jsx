import React, { useState, useEffect, useRef } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { validateResetToken, resetPassword } from "../api/users";

const ResetPasswordForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const errorTimeoutRef = useRef(null);

  // Validar token al cargar
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const checkToken = async () => {
      const result = await validateResetToken(token);
      setTokenValid(result.valid);
      setLoading(false);
    };

    checkToken();
  }, [token]);

  // Auto-clear error después de 5 segundos
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

    // Validaciones frontend
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setSubmitting(true);

    try {
      await resetPassword(token, password);
      setSuccess(true);
      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 3000);
    } catch (err) {
      setError(err.message || "Error al restablecer la contraseña.");
    } finally {
      setSubmitting(false);
    }
  };

  // Estado de carga - validando token
  if (loading) {
    return (
      <div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-2xl border border-gray-100">
        <div className="text-center">
          <div className="animate-spin mx-auto h-12 w-12 border-4 border-red-600 border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-600">Validando link...</p>
        </div>
      </div>
    );
  }

  // Token inválido o no proporcionado
  if (!token || !tokenValid) {
    return (
      <div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-2xl border border-gray-100">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
            <svg
              className="h-6 w-6 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Link expirado o inválido
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            Este link de recuperación ha expirado o ya fue utilizado.
          </p>
          <p className="text-xs text-gray-500 mb-6">
            Los links expiran después de 15 minutos por seguridad.
          </p>
          <Link
            to="/forgot-password"
            className="inline-block w-full bg-red-600 text-white py-3 px-4 rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 font-medium text-center"
          >
            Solicitar nuevo link
          </Link>
          <p className="text-center mt-4 text-sm text-gray-600">
            <Link to="/login" className="text-red-600 hover:underline">
              ← Volver al inicio de sesión
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // Éxito - contraseña cambiada
  if (success) {
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
            ¡Contraseña actualizada!
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Tu contraseña ha sido restablecida exitosamente.
          </p>
          <p className="text-xs text-gray-500 mb-4">
            Serás redirigido al inicio de sesión en unos segundos...
          </p>
          <Link
            to="/login"
            className="text-red-600 hover:underline text-sm font-medium"
          >
            Ir al inicio de sesión ahora →
          </Link>
        </div>
      </div>
    );
  }

  // Formulario de nueva contraseña
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
          Crear nueva contraseña
        </h2>
        <p className="text-sm text-gray-600 mt-2">
          Ingresá tu nueva contraseña para acceder a tu cuenta.
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
            htmlFor="password"
            className="block text-md font-medium text-black mb-1"
          >
            Nueva contraseña
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 pr-12"
              placeholder="••••••••"
              required
              autoComplete="new-password"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">Mínimo 8 caracteres</p>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-md font-medium text-black mb-1"
          >
            Confirmar contraseña
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 pr-12"
              placeholder="••••••••"
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-red-600 text-white py-3 px-4 rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
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
              Guardando...
            </span>
          ) : (
            "Cambiar contraseña"
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

export default ResetPasswordForm;
