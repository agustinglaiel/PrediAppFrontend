import React from "react";
import PropTypes from "prop-types";

/**
 * Tarjeta para mostrar información del usuario en la página de perfil.
 * Props:
 * - user: objeto con los datos del usuario
 * - onEditProfile: función callback para manejar el clic en "Editar Perfil"
 */
const UserCardInfo = ({ user, onEditProfile }) => {
  if (!user) return null;
  
  return (
    <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto mt-6 overflow-hidden">
      {/* Sección superior con fondo rojo */}
      <div className="bg-red-700 px-6 pt-6 pb-4">
        {/* Imagen de perfil */}
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

      {/* Sección de información con fondo blanco */}
      <div className="px-6 pb-6">
        {/* Información del usuario */}
        <div className="space-y-3 text-sm mt-4">
        {/* Nombre y Apellido en la misma fila */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">Nombre:</span>
            <span className="text-gray-800 text-lg">{user.firstName}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">Apellido:</span>
            <span className="text-gray-800 text-lg">{user.lastName}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">Nombre de usuario:</span>
          <span className="text-gray-800 text-lg">{user.username}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">Email:</span>
          <span className="text-gray-800 text-lg">{user.email}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">Puntos:</span>
          <span className="text-gray-800 text-lg font-semibold text-red-700">{user.score}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-600 text-xs uppercase tracking-wide">Número de teléfono:</span>
          <span className="text-gray-800 text-lg">{user.phoneNumber || " - "}</span>
        </div>
      </div>

      {/* Botón Editar Perfil */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={onEditProfile}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Editar Perfil
        </button>
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
  onEditProfile: PropTypes.func,
};

UserCardInfo.defaultProps = {
  onEditProfile: () => console.log("Editar perfil clickeado"),
};

export default UserCardInfo;