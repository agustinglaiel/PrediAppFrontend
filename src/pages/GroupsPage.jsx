// src/pages/GroupsPage.jsx
import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import NavigationBar from "../components/NavigationBar";
import GroupPreview from "../components/groups/GroupPreview";
import NewGroupModal from "../components/groups/NewGroupModal";
import MessageStatus from "../components/MessageStatus";
import WarningModal from "../components/WarningModal";
import { getGroupByUserId, joinGroup } from "../api/groups";
import { AuthContext } from "../contexts/AuthContext";

const GroupsPage = () => {
  const { user } = useContext(AuthContext);
  const userId = user?.id;
  const isLoggedIn = Boolean(userId);

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joinCode, setJoinCode] = useState("");
  const [joinLoading, setJoinLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [warningMessage, setWarningMessage] = useState(null);

  /* fetch grupos */
  const fetchGroups = async () => {
    try {
      setLoading(true);
      const { data } = await getGroupByUserId(userId);
      setGroups(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchGroups();
    } else {
      setLoading(false);
      setWarningMessage(
        "Es necesario iniciar sesión para acceder a esta funcionalidad."
      );
    }
  }, [isLoggedIn]);

  /* join */
  const handleJoin = async (e) => {
    e.preventDefault();
    if (!joinCode.trim()) {
      setToast({ text: "Ingresa un código de grupo.", status: 400 });
      return;
    }
    try {
      setJoinLoading(true);
      const { status, message } = await joinGroup(joinCode.trim(), userId);
      setToast({ text: message, status });
      setJoinCode("");
      fetchGroups();
    } catch (err) {
      setToast({ text: err.message, status: err.status ?? 500 });
    } finally {
      setJoinLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  // Filtrar grupos en los que el usuario NO tiene role "invited"
  const visibleGroups = groups.filter((g) => {
    const membership = g.users.find((u) => u.user_id === userId);
    return membership && membership.role !== "invited";
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <NavigationBar />

      <main className="flex-grow pt-24 px-4">
        {/* título + botón */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Grupos</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={!isLoggedIn}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Crear grupo
          </button>
        </div>

        {/* buscador unificado */}
        <div className="max-w-md mb-8 ml-auto">
          <form onSubmit={handleJoin}>
            <div className="flex w-full bg-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
              <input
                type="text"
                placeholder="Ingresa el código del grupo"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                disabled={!isLoggedIn}
                className="flex-grow py-2 px-4 bg-transparent focus:outline-none placeholder-gray-500 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!isLoggedIn || joinLoading}
                className="py-2 px-4 text-black font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {joinLoading ? "Enviando…" : "Unirme"}
              </button>
            </div>
          </form>
        </div>

        {/* error de fetch */}
        {error && (
          <div className="mb-6 px-4 py-2 rounded bg-red-100 text-red-700">
            {error}
          </div>
        )}

        {/* lista de grupos filtrados */}
        {visibleGroups.length > 0 && (
          <div>
            {visibleGroups.map((g, index) => {
              // Filtrar usuarios que no tengan role "invited"
              const activeMembersCount =
                g.users?.filter((u) => u.role !== "invited").length ?? 0;

              return (
                <Link
                  key={g.id}
                  to={`/grupos/${g.id}`}
                  className={`block ${
                    index < visibleGroups.length - 1 ? "mb-4" : ""
                  }`}
                >
                  <GroupPreview
                    name={g.group_name}
                    count={activeMembersCount}
                  />
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <footer className="bg-gray-200 text-gray-700 text-center py-3 text-sm">
        <p>© 2025 PrediApp</p>
      </footer>

      {/* modal crear grupo */}
      {isModalOpen && (
        <NewGroupModal
          userId={userId}
          onSuccess={(newGroup) => {
            setGroups((prev) => [...prev, newGroup]);
            setIsModalOpen(false);
            setToast({
              text: `Grupo ${newGroup.group_name} creado.`,
              status: 201,
            });
          }}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* toast / globo */}
      {toast && (
        <MessageStatus
          text={toast.text}
          status={toast.status}
          onHide={() => setToast(null)}
        />
      )}

      {/* warning modal */}
      {warningMessage && (
        <WarningModal
          message={warningMessage}
          onClose={() => setWarningMessage(null)}
        />
      )}
    </div>
  );
};

export default GroupsPage;
