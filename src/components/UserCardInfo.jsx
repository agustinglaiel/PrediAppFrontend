import React, { useState } from "react";
import PropTypes from "prop-types";

/**
 * Tarjeta para mostrar / editar la información del usuario.
 * - user: objeto con los datos actuales
 * - onSave: callback con el objeto actualizado cuando el usuario pulsa "Guardar cambios"
 */
const UserCardInfo = ({ user, onSave }) => {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ ...user });
  
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
    
  const toggleEdit = () => {
    // si pasamos de editMode=true a false sin guardar ⇒ revertimos
    if (editMode) setForm({ ...user });
    setEditMode((prev) => !prev);
  };
  
  const handleSave = () => {
    onSave(form);
    setEditMode(false);
  };
  
  if (!user) return null;
  
  return (
    <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto mt-6 overflow-hidden">
      {/* ─── Cabecera roja con avatar ─────────────────────── */}
      <div className="bg-red-700 px-6 pt-6 pb-4">
        <div className="flex justify-center">
          {user.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt={`${user.firstName} avatar`}
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-xl">👤</span>
            </div>
          )}
        </div>
      </div>
      
      {/* ─── Cuerpo blanco ───────────────────────────────── */}
      <div className="px-6 pb-6">
        {editMode ? (
          // Modo edición: campos uno debajo del otro con mejor alineación
          <div className="space-y-4 mt-4">
            {/* Nombre */}
            <div className="flex items-center">
              <span className="font-medium text-gray-600 text-xs uppercase tracking-wide w-32">
                Nombre:
              </span>
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className="flex-1 border-b border-gray-300 focus:outline-none focus:border-blue-500 text-gray-800 text-lg bg-transparent py-1"
              />
            </div>
            
            {/* Apellido */}
            <div className="flex items-center">
              <span className="font-medium text-gray-600 text-xs uppercase tracking-wide w-32">
                Apellido:
              </span>
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className="flex-1 border-b border-gray-300 focus:outline-none focus:border-blue-500 text-gray-800 text-lg bg-transparent py-1"
              />
            </div>
            
            {/* Username */}
            <div className="flex items-center">
              <span className="font-medium text-gray-600 text-xs uppercase tracking-wide w-32">
                Nombre de usuario:
              </span>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                className="flex-1 border-b border-gray-300 focus:outline-none focus:border-blue-500 text-gray-800 text-lg bg-transparent py-1"
              />
            </div>
            
            {/* Email */}
            <div className="flex items-center">
              <span className="font-medium text-gray-600 text-xs uppercase tracking-wide w-32">
                Email:
              </span>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="flex-1 border-b border-gray-300 focus:outline-none focus:border-blue-500 text-gray-800 text-lg bg-transparent py-1"
              />
            </div>
            
            {/* Puntos (solo lectura) */}
            <div className="flex items-center">
              <span className="font-medium text-gray-600 text-xs uppercase tracking-wide w-32">
                Puntos:
              </span>
              <span className="text-gray-800 text-lg font-semibold text-red-700">
                {user.score}
              </span>
            </div>
            
            {/* Teléfono */}
            <div className="flex items-center">
              <span className="font-medium text-gray-600 text-xs uppercase tracking-wide w-32">
                Número de teléfono:
              </span>
              <input
                name="phoneNumber"
                value={form.phoneNumber || ""}
                onChange={handleChange}
                className="flex-1 border-b border-gray-300 focus:outline-none focus:border-blue-500 text-gray-800 text-lg bg-transparent py-1"
                placeholder="-"
              />
            </div>
          </div>
        ) : (
          // Modo vista: layout compacto original
          <div className="space-y-3 text-sm mt-4">
            {/* Nombre + Apellido en la misma fila */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">
                  Nombre:
                </span>
                <span className="text-gray-800 text-lg">{user.firstName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">
                  Apellido:
                </span>
                <span className="text-gray-800 text-lg">{user.lastName}</span>
              </div>
            </div>
            
            {/* Username */}
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">
                Nombre de usuario:
              </span>
              <span className="text-gray-800 text-lg">{user.username}</span>
            </div>
            
            {/* Email */}
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">
                Email:
              </span>
              <span className="text-gray-800 text-lg">{user.email}</span>
            </div>
            
            {/* Puntos (solo lectura) */}
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">
                Puntos:
              </span>
              <span className="text-gray-800 text-lg font-semibold text-red-700">
                {user.score}
              </span>
            </div>
            
            {/* Teléfono */}
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">
                Número de teléfono:
              </span>
              <span className="text-gray-800 text-lg">
                {user.phoneNumber || " -"}
              </span>
            </div>
          </div>
        )}
        
        {/* Botón inferior */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          {editMode ? (
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-1.5 px-3 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-sm"
              >
                Guardar cambios
              </button>
              <button
                onClick={toggleEdit}
                className="flex-1 bg-red-700 hover:bg-red-700 text-white font-medium py-1.5 px-3 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 text-sm"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <button
              onClick={toggleEdit}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Editar Perfil
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

UserCardInfo.propTypes = {
  user: PropTypes.shape({
    profileImageUrl: PropTypes.string,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    score: PropTypes.number.isRequired,
    phoneNumber: PropTypes.string,
  }).isRequired,
  onSave: PropTypes.func.isRequired,
};

export default UserCardInfo;