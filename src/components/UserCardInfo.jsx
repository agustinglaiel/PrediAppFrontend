import React from "react";
import PropTypes from "prop-types";

/**
 * Tarjeta para mostrar información del usuario en la página de perfil.
 * Props:
 * - user: objeto con los datos del usuario
 */
const UserCardInfo = ({ user }) => {
  if (!user) return null;

  return (
    <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto p-6 mt-6">
      {/* Imagen de perfil */}
      {user.profileImageUrl ? (
        <img
          src={user.profileImageUrl}
          alt={`${user.firstName} avatar`}
          className="w-24 h-24 rounded-full mx-auto object-cover"
        />
      ) : (
        <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto" />
      )}

      <h2 className="mt-4 text-2xl font-semibold text-gray-800 text-center">
        {user.firstName} {user.lastName}
      </h2>
      <p className="text-gray-600 text-center">@{user.username}</p>

      <div className="mt-6 space-y-2 text-gray-700">
        <p>
          <span className="font-medium">Email: </span>
          {user.email}
        </p>
        <p>
          <span className="font-medium">Puntos: </span>
          {user.score}
        </p>
        <p>
          <span className="font-medium">Teléfono: </span>
          {user.phoneNumber || "-"}
        </p>
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
};

export default UserCardInfo;
