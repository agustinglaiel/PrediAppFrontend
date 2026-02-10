// src/pages/GroupsPage.jsx
import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { IoIosPeople, IoIosAdd, IoIosArrowForward } from "react-icons/io";
import Header from "../components/Header";
import NavigationBar from "../components/NavigationBar";
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
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 gap-3">
        <div className="w-10 h-10 border-4 border-red-200 border-t-red-500 rounded-full animate-spin" />
        <p className="text-gray-500 text-sm font-medium">Cargando grupos…</p>
      </div>
    );
  }

  // Filtrar grupos en los que el usuario NO tiene role "Invited"
  const visibleGroups = groups.filter((g) => {
    const membership = g.users.find((u) => u.user_id === userId);
    return membership && membership.role !== "Invited";
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <NavigationBar />

      <main className="flex-grow pt-20 pb-24">
        <div className="max-w-2xl mx-auto px-4">

          {/* ── Encabezado con título y botón ── */}
          <div className="flex justify-between items-center mb-5">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mis Grupos</h1>
              {/* {visibleGroups.length > 0 && (
                <p className="text-sm text-gray-500 mt-0.5">
                  {visibleGroups.length}{" "}
                  {visibleGroups.length === 1 ? "grupo" : "grupos"}
                </p>
              )} */}
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={!isLoggedIn}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:from-red-600 hover:to-red-700 active:scale-[0.97] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              <IoIosAdd className="text-lg" />
              Crear grupo
            </button>
          </div>

          {/* ── Unirse a un grupo ── */}
          <div className="mb-6">
            <form onSubmit={handleJoin}>
              <div className="flex w-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-red-500/30 focus-within:border-red-400 transition-all duration-200">
                <input
                  type="text"
                  placeholder="Ingresa el código de invitación"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  disabled={!isLoggedIn}
                  className="flex-grow py-3 px-4 bg-transparent text-sm focus:outline-none placeholder-gray-400 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!isLoggedIn || joinLoading}
                  className="px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {joinLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 border-2 border-red-200 border-t-red-500 rounded-full animate-spin" />
                      Enviando
                    </span>
                  ) : (
                    "Unirme"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* ── Error de fetch ── */}
          {error && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium flex items-center gap-2">
              <span className="text-red-400 text-base">⚠</span>
              {error}
            </div>
          )}

          {/* ── Lista de grupos ── */}
          {visibleGroups.length > 0 ? (
            <div className="space-y-3">
              {visibleGroups.map((g, index) => {
                const activeMembersCount =
                  g.users?.filter((u) => u.role !== "Invited").length ?? 0;
                const initials = g.group_name
                  .split(" ")
                  .slice(0, 2)
                  .map((w) => w[0]?.toUpperCase())
                  .join("");

                return (
                  <Link
                    key={g.id}
                    to={`/grupos/${g.id}`}
                    className="block group"
                  >
                    <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl px-4 py-4 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 active:scale-[0.99]">
                      {/* Avatar con iniciales */}
                      <div
                        className="flex-shrink-0 w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center shadow-sm"
                      >
                        <span className="text-white font-bold text-sm tracking-wide">
                          {initials}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="flex-grow min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate text-[15px]">
                          {g.group_name}
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                          <IoIosPeople className="text-gray-400 text-base" />
                          {activeMembersCount}{" "}
                          {activeMembersCount === 1 ? "miembro" : "miembros"}
                        </p>
                      </div>

                      {/* Flecha */}
                      <IoIosArrowForward className="text-gray-300 text-xl flex-shrink-0 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all duration-200" />
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            /* ── Estado vacío ── */
            !error && (
              <div className="flex flex-col items-center justify-center py-16 px-6">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-5">
                  <IoIosPeople className="text-4xl text-gray-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1.5">
                  Sin grupos aún
                </h3>
                <p className="text-sm text-gray-500 text-center max-w-xs leading-relaxed">
                  Crea un grupo para competir con tus amigos o únete a uno con
                  un código de invitación.
                </p>
              </div>
            )
          )}
        </div>
      </main>

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
