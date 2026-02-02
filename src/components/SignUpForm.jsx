import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { signUp as apiSignUp } from "../api/users";

const SignupForm = () => {
  const { login: contextLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    phone_number: "",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      // 1) Llamar al API, que devuelve { token, id, first_name, … }
      const userData = await apiSignUp(formData);
      // 2) Contexto guarda el JWT y decodifica para poblar user
      contextLogin(userData);
      // 3) Redirigir según rol
      if (userData.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      setError(
        err.message ||
          "Error al registrarse. Verifica los datos o contacta al soporte."
      );
    }
  };

  return (
    <div className="w-full max-w-sm p-6 bg-white rounded-2xl shadow-2xl border border-gray-100">
      {/* <h2 className="text-2xl font-semibold text-center text-gray-800 mb-5">
        Registrarse
      </h2> */}
      {error && (
        <p className="text-red-600 text-center mb-4 text-sm font-medium">
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="first_name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nombre
          </label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            placeholder="Tu nombre"
            required
            autoComplete="given-name"
          />
        </div>
        <div>
          <label
            htmlFor="last_name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Apellido
          </label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            placeholder="Tu apellido"
            required
            autoComplete="family-name"
          />
        </div>
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nombre de usuario
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            placeholder="tu_usuario"
            required
            autoComplete="username"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            placeholder="tu@email.com"
            required
            autoComplete="email"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            placeholder="••••••••"
            required
            autoComplete="new-password"
          />
        </div>
        <div>
          <label
            htmlFor="phone_number"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Número de teléfono (opcional)
          </label>
          <input
            type="tel"
            id="phone_number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            placeholder="+1234567890"
            autoComplete="tel"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 px-4 rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 font-medium"
        >
          Registrarse
        </button>
      </form>
      <p className="text-center mt-3 text-sm text-gray-600">
        ¿Ya tienes una cuenta?{" "}
        <Link to="/login" className="text-red-600 hover:underline">
          Inicia sesión aquí
        </Link>
      </p>
    </div>
  );
};

export default SignupForm;
