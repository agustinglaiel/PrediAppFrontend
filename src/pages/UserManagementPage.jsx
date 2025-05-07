import React, { useState, useEffect } from "react";
import { getUsers, updateUserById, deleteUserById } from "../api/users";
import Header from "../components/Header";
import NavigationBar from "../components/NavigationBar";

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      } catch (err) {
        setError(err.message || "Error al eliminar usuario.");
      }
    }
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
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                      >
                        Cambiar Rol
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="mt-6 ml-0 text-left w-1/3 bg-gray-200 p-4 rounded">
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

export default UserManagementPage;
