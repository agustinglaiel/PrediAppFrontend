// src/components/UserCardInfo.jsx
import React, { useState, useRef } from "react";
import PropTypes from "prop-types";

/**
 * Props:
 * - user: { firstName, lastName, username, email, score, phoneNumber, profileImageUrl }
 * - onSave(updatedUser): se llama al pulsar “Guardar cambios”
 * - onImageUpload(file): se llama en cuanto se elige un nuevo archivo
 */
const UserCardInfo = ({ user, onSave, onImageUpload }) => {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ ...user });
  const [previewImage, setPreviewImage] = useState(user.profileImageUrl);
  const fileInputRef = useRef(null);

  // mantener formulario sincronizado
  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  // cuando seleccionan imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      return alert("Selecciona una imagen válida.");
    }
    onImageUpload(file);
  };

  // alternar modo edición
  const toggleEdit = () => {
    if (editMode) {
      setForm({ ...user });
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
    setEditMode((e) => !e);
  };

  // guardar cambios texto
  const handleSaveClick = () => {
    onSave(form);
    setEditMode(false);
  };

  if (!user) return null;

  return (
    <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto mt-6 overflow-hidden">
      {/* cabecera roja + avatar */}
      <div className="bg-red-700 px-6 pt-6 pb-4">
        <div className="flex justify-center">
          <div className="relative">
            {user.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt={`${user.firstName} avatar`}
                className={`w-24 h-24 rounded-full object-cover ${
                  editMode
                    ? "cursor-pointer hover:opacity-80 transition-opacity"
                    : ""
                }`}
                onClick={() => editMode && fileInputRef.current.click()}
              />
            ) : (
              <div
                className={`w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center ${
                  editMode
                    ? "cursor-pointer hover:bg-gray-300 transition-colors"
                    : ""
                }`}
                onClick={() => editMode && fileInputRef.current.click()}
              >
                <span className="text-gray-400 text-xl">👤</span>
              </div>
            )}
            {editMode && (
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            )}
          </div>
        </div>
        {editMode && (
          <p className="text-white text-xs text-center mt-2 opacity-90">
            Haz clic en la imagen para cambiarla
          </p>
        )}
      </div>

      {/* cuerpo, edición o vista */}
      <div className="px-6 pb-6">
        {editMode ? (
          <div className="space-y-4 mt-4">
            {/** Nombre */}
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
            {/** Apellido */}
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
            {/** Username */}
            <div className="flex items-center">
              <span className="font-medium text-gray-600 text-xs uppercase tracking-wide w-32">
                Usuario:
              </span>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                className="flex-1 border-b border-gray-300 focus:outline-none focus:border-blue-500 text-gray-800 text-lg bg-transparent py-1"
              />
            </div>
            {/** Email */}
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
            {/** Score solo lectura */}
            <div className="flex items-center">
              <span className="font-medium text-gray-600 text-xs uppercase tracking-wide w-32">
                Puntos:
              </span>
              <span className="text-gray-800 text-lg font-semibold text-red-700">
                {user.score}
              </span>
            </div>
            {/** Teléfono */}
            <div className="flex items-center">
              <span className="font-medium text-gray-600 text-xs uppercase tracking-wide w-32">
                Teléfono:
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
          <div className="space-y-3 text-sm mt-4">
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
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">
                Usuario:
              </span>
              <span className="text-gray-800 text-lg">{user.username}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">
                Email:
              </span>
              <span className="text-gray-800 text-lg">{user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">
                Puntos:
              </span>
              <span className="text-gray-800 text-lg font-semibold text-red-700">
                {user.score}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">
                Teléfono:
              </span>
              <span className="text-gray-800 text-lg">{user.phoneNumber}</span>
            </div>
          </div>
        )}

        {/* botones */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          {editMode ? (
            <div className="flex gap-3">
              <button
                onClick={handleSaveClick}
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
    firstName:       PropTypes.string.isRequired,
    lastName:        PropTypes.string.isRequired,
    username:        PropTypes.string.isRequired,
    email:           PropTypes.string.isRequired,
    score:           PropTypes.number.isRequired,
    phoneNumber:     PropTypes.string,
  }).isRequired,
  onSave:          PropTypes.func.isRequired,
  onImageUpload:   PropTypes.func.isRequired,
};

export default UserCardInfo;
