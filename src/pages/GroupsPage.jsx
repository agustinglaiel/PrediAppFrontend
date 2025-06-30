import React, { useEffect, useState, useContext } from "react";
import Header from "../components/Header";
import NavigationBar from "../components/NavigationBar";
import GroupPreview from "../components/groups/GroupPreview";
import NewGroupModal from "../components/groups/NewGroupModal";
import { getGroupByUserId, joinGroup } from "../api/groups";
import { AuthContext } from "../contexts/AuthContext";

const GroupsPage = () => {
  const [groups, setGroups] = useState([]); // ⬅️ ahora array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [joinCode, setJoinCode] = useState("");
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinMsg, setJoinMsg] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { user } = useContext(AuthContext);
  const userId = user?.id;

  /* ───────────────────── Fetch grupos ───────────────────── */
  const fetchGroups = async () => {
    try {
      setLoading(true);
      const data = await getGroupByUserId(userId); // ahora array o null
      setGroups(Array.isArray(data) ? data : []); // guardamos slice
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchGroups();
    } else {
      setLoading(false);
      setError("No se encontró el ID del usuario.");
    }
  }, [userId]);

  /* ───────────────────── Join por código ───────────────────── */
  const handleJoin = async (e) => {
    e.preventDefault();
    if (!joinCode.trim()) {
      setJoinMsg({ type: "error", text: "Ingresa un código de grupo." });
      return;
    }
    try {
      setJoinLoading(true);
      await joinGroup(joinCode.trim(), userId);
      setJoinMsg({
        type: "success",
        text: "Solicitud enviada. Espera la aprobación del creador del grupo.",
      });
      setJoinCode("");
    } catch (err) {
      setJoinMsg({ type: "error", text: err.message });
    } finally {
      setJoinLoading(false);
    }
  };

  /* ───────────────────── Loading global ───────────────────── */
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  /* ────────────────────────── UI ────────────────────────── */
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <NavigationBar />

      <main className="flex-grow pt-24 px-4">
        {/* Título + botón */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Grupos</h1>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Crear grupo
          </button>
        </div>

        {/* Buscador SIEMPRE visible */}
        <div className="max-w-md mb-8">
          <form onSubmit={handleJoin} className="flex gap-2">
            <input
              type="text"
              placeholder="Ingresa el código del grupo"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              className="flex-grow py-2 px-4 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500"
            />
            <button
              type="submit"
              disabled={joinLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {joinLoading ? "Enviando…" : "Unirme"}
            </button>
          </form>

          {joinMsg && (
            <p
              className={`mt-3 text-sm ${
                joinMsg.type === "success" ? "text-green-700" : "text-red-700"
              }`}
            >
              {joinMsg.text}
            </p>
          )}
        </div>

        {/* Error general */}
        {error && (
          <div className="mb-6 px-4 py-2 rounded bg-red-100 text-red-700">
            {error}
          </div>
        )}

        {/* Lista de grupos */}
        {groups.length > 0 && (
          <div className="space-y-4">
            {groups.map((g) => (
              <GroupPreview
                key={g.id}
                name={g.group_name}
                count={g.users?.length ?? 0}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="bg-gray-200 text-gray-700 text-center py-3 text-sm">
        <p>© 2025 PrediApp</p>
      </footer>

      {/* Modal de creación */}
      {isModalOpen && (
        <NewGroupModal
          userId={userId}
          onSuccess={(newGroup) => {
            setGroups((prev) => [...prev, newGroup]);
            setIsModalOpen(false);
          }}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default GroupsPage;
