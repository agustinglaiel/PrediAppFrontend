import React, { useState, useEffect } from "react";
import { getUsers, updateUserById, deleteUserById } from "../api/users";
import Header from "../components/Header";
import NavigationBar from "../components/NavigationBar";

const AdminUsersManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedUser, setExpandedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        setError(err.message || "Error al cargar usuarios.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleUpdateUser = async (userId, updatedData) => {
    try {
      await updateUserById(userId, updatedData);
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, ...updatedData } : user
        )
      );
    } catch (err) {
      setError(err.message || "Error al actualizar usuario.");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("¿Estás seguro de eliminar este usuario?")) {
      try {
        await deleteUserById(userId);
        setUsers(users.filter((user) => user.id !== userId));
        // Cerrar el desplegable si el usuario eliminado estaba expandido
        if (expandedUser === userId) {
          setExpandedUser(null);
        }
      } catch (err) {
        setError(err.message || "Error al eliminar usuario.");
      }
    }
  };

  const toggleExpand = (userId) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-600">Cargando usuarios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow pt-24 px-4">
        <h1 className="text-3xl font-bold mb-6">Gestión de Usuarios</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Lista de Usuarios</h2>
          {users.length === 0 ? (
            <p className="text-gray-600">No hay usuarios registrados.</p>
          ) : (
            <>
              {/* Vista de escritorio - tabla completa */}
              <div className="hidden md:block">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-3 text-left w-1/5">ID</th>
                      <th className="p-3 text-left w-1/5">Nombre de Usuario</th>
                      <th className="p-3 text-left w-1/5">Email</th>
                      <th className="p-3 text-left w-1/5">Rol</th>
                      <th className="p-3 text-left w-1/5">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b">
                        <td className="p-3">{user.id}</td>
                        <td className="p-3">{user.username}</td>
                        <td className="p-3">{user.email}</td>
                        <td className="p-3">{user.role}</td>
                        <td className="p-3">
                          <button
                            onClick={() =>
                              handleUpdateUser(user.id, {
                                role: user.role === "admin" ? "user" : "admin",
                              })
                            }
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2 text-sm"
                          >
                            Cambiar Rol
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Vista móvil - lista con desplegables */}
              <div className="block md:hidden">
                <div className="space-y-2">
                  {users.map((user) => (
                    <div key={user.id} className="border border-gray-200 rounded-lg">
                      {/* Fila clickeable que muestra ID y username */}
                      <div
                        onClick={() => toggleExpand(user.id)}
                        className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium text-gray-600">
                            ID: {user.id}
                          </span>
                          <span className="text-sm font-semibold text-gray-900">
                            {user.username}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            user.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {user.role}
                          </span>
                          <svg
                            className={`w-5 h-5 ml-2 transform transition-transform ${
                              expandedUser === user.id ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>

                      {/* Contenido desplegable */}
                      {expandedUser === user.id && (
                        <div className="px-4 pb-4 border-t border-gray-200 bg-gray-50">
                          <div className="pt-3 space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-600">Email:</span>
                              <span className="text-sm text-gray-900">{user.email}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-600">Rol:</span>
                              <span className={`text-sm px-2 py-1 rounded ${
                                user.role === 'admin' 
                                  ? 'bg-purple-100 text-purple-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {user.role}
                              </span>
                            </div>
                            
                            {/* Botones de acción */}
                            <div className="pt-3 flex space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateUser(user.id, {
                                    role: user.role === "admin" ? "user" : "admin",
                                  });
                                }}
                                className="flex-1 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm font-medium"
                              >
                                Cambiar a {user.role === "admin" ? "Usuario" : "Admin"}
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteUser(user.id);
                                }}
                                className="flex-1 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm font-medium"
                              >
                                Eliminar
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Estadísticas - responsive */}
        <div className="mt-6 bg-gray-200 p-4 rounded w-full md:w-1/3">
          <h3 className="text-lg font-semibold mb-2">Estadísticas</h3>
          <p>Cantidad de usuarios: {users.length}</p>
        </div>
      </main>
      <footer className="bg-gray-200 text-gray-700 text-center py-3 text-sm">
        <p>© 2025 PrediApp</p>
      </footer>
    </div>
  );
};

export default AdminUsersManagementPage;