// src/components/UserCardInfo.jsx
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  IoPersonOutline,
  IoMailOutline,
  IoCallOutline,
  IoTrophyOutline,
  IoCreateOutline,
  IoCheckmarkOutline,
  IoCloseOutline,
} from "react-icons/io5";

/**
 * Props:
 * - user: { firstName, lastName, username, email, score, phoneNumber }
 * - onSave(updatedUser): se llama al pulsar "Guardar cambios"
 */
const UserCardInfo = ({ user, onSave }) => {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ ...user });

  useEffect(() => {
    setForm({ ...user });
  }, [user]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const toggleEdit = () => {
    if (editMode) {
      setForm({ ...user });
    }
    setEditMode((e) => !e);
  };

  const handleSaveClick = () => {
    onSave(form);
    setEditMode(false);
  };

  if (!user) return null;

  const initials =
    `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() || "U";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Cabecera con gradiente + avatar de iniciales */}
      <div className="relative bg-gradient-to-r from-red-500 to-red-600 px-6 pt-8 pb-14">
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
          <div className="w-20 h-20 rounded-2xl bg-white shadow-lg shadow-red-500/20 flex items-center justify-center border-4 border-white">
            <span className="text-red-600 font-bold text-2xl tracking-wide">
              {initials}
            </span>
          </div>
        </div>
      </div>

      {/* Nombre y username debajo del avatar */}
      <div className="pt-14 pb-2 px-6 text-center">
        <h2 className="text-xl font-bold text-gray-900">
          {user.firstName} {user.lastName}
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">@{user.username}</p>
      </div>

      {/* Score destacado */}
      <div className="px-6 pb-4">
        <div className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 rounded-xl mx-auto max-w-xs">
          <IoTrophyOutline className="text-red-500 text-xl" />
          <span className="text-sm font-semibold text-gray-600">Puntos:</span>
          <span className="text-lg font-bold text-red-600">{user.score ?? 0}</span>
        </div>
      </div>

      {/* Campos del perfil */}
      <div className="px-6 pb-6">
        {editMode ? (
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                <IoPersonOutline className="text-sm" />
                Nombre
              </label>
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-all duration-200"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                <IoPersonOutline className="text-sm" />
                Apellido
              </label>
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-all duration-200"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                <IoPersonOutline className="text-sm" />
                Usuario
              </label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-all duration-200"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                <IoMailOutline className="text-sm" />
                Email
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-all duration-200"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                <IoCallOutline className="text-sm" />
                Telefono
              </label>
              <input
                name="phoneNumber"
                value={form.phoneNumber || ""}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-all duration-200"
                placeholder="Sin telefono registrado"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors duration-150">
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                <IoPersonOutline className="text-gray-500 text-lg" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Nombre completo</p>
                <p className="text-sm font-medium text-gray-800 truncate">{user.firstName} {user.lastName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors duration-150">
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                <IoPersonOutline className="text-gray-500 text-lg" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Usuario</p>
                <p className="text-sm font-medium text-gray-800 truncate">@{user.username}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors duration-150">
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                <IoMailOutline className="text-gray-500 text-lg" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Email</p>
                <p className="text-sm font-medium text-gray-800 truncate">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors duration-150">
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                <IoCallOutline className="text-gray-500 text-lg" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Telefono</p>
                <p className="text-sm font-medium text-gray-800 truncate">{user.phoneNumber || "Sin registrar"}</p>
              </div>
            </div>
          </div>
        )}

        {/* Botones */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          {editMode ? (
            <div className="flex gap-3">
              <button
                onClick={handleSaveClick}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-lg shadow-green-500/25 hover:shadow-green-500/40 active:scale-[0.97] transition-all duration-200 text-sm"
              >
                <IoCheckmarkOutline className="text-base" />
                Guardar
              </button>
              <button
                onClick={toggleEdit}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 px-4 rounded-xl active:scale-[0.97] transition-all duration-200 text-sm"
              >
                <IoCloseOutline className="text-base" />
                Cancelar
              </button>
            </div>
          ) : (
            <button
              onClick={toggleEdit}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-lg shadow-red-500/25 hover:shadow-red-500/40 active:scale-[0.97] transition-all duration-200 text-sm"
            >
              <IoCreateOutline className="text-base" />
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
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    score: PropTypes.number,
    phoneNumber: PropTypes.string,
  }).isRequired,
  onSave: PropTypes.func.isRequired,
};

export default UserCardInfo;
