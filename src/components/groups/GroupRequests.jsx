// src/components/GroupRequests.jsx
import React, { useState, useEffect } from "react";
import { manageGroupInvitation } from "../../api/groups";

const GroupRequests = ({
  groupId,
  creatorId,
  requests = [],      // [{ user_id, username }]
  loading,
  error,
  onClose
}) => {
  // Cópia local para filtrar filas al aceptar/rechazar
  const [pending, setPending] = useState([]);

  useEffect(() => {
    setPending(requests);
  }, [requests]);

  const handleAction = async (targetUserId, action) => {
    try {
      await manageGroupInvitation({
        groupId,
        creatorId,
        targetUserId,
        action
      });
      // eliminamos de la lista local
      setPending(pending.filter(u => u.user_id !== targetUserId));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden w-full max-w-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Solicitudes para unirse
          </h2>

          {loading ? (
            <p className="text-center">Cargando...</p>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 font-semibold text-gray-700 text-center">
                      Usuario
                    </th>
                    <th className="py-3 font-semibold text-gray-700 text-center">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pending.length > 0 ? (
                    pending.map(({ user_id, username }) => (
                      <tr
                        key={user_id}
                        className="border-b border-gray-100 last:border-b-0"
                      >
                        <td className="py-3 text-gray-800 text-center">
                          {username}
                        </td>
                        <td className="py-3 text-center space-x-2">
                          <button
                            onClick={() => handleAction(user_id, "accept")}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            Aceptar
                          </button>
                          <button
                            onClick={() => handleAction(user_id, "reject")}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            Rechazar
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={2}
                        className="py-4 text-gray-600 text-center"
                      >
                        No hay solicitudes pendientes.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupRequests;
