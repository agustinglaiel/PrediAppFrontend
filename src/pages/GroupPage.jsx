// src/pages/GroupPage.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import NavigationBar from "../components/NavigationBar";
import WarningModal from "../components/WarningModal";
import Leaderboard from "../components/Leaderboard";
import { AuthContext } from "../contexts/AuthContext";
import { getGroupById, getJoinRequestByGroupId } from "../api/groups";
import { getUserScoreByUserId } from "../api/users";

const GroupPage = () => {
  const { user } = useContext(AuthContext);
  const loggedUserId = user?.id;
  const { groupId } = useParams();

  const [group, setGroup] = useState(null);
  const [userScores, setUserScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [joinRequests, setJoinRequests] = useState([]);
  const [joinReqLoading, setJoinReqLoading] = useState(false);
  const [joinReqError, setJoinReqError] = useState(null);

  const fetchGroup = async () => {
    try {
      setLoading(true);
      const { data: grp } = await getGroupById(groupId);
      setGroup(grp);

      // sólo usuarios con role != "invited"
      const validUsers = grp.users.filter(u => u.role !== "invited");
      const scores = await Promise.all(
        validUsers.map(async u => {
          const { data } = await getUserScoreByUserId(u.user_id);
          return {
            user_id: u.user_id,
            username: data.username,
            score: data.score,
          };
        })
      );
      setUserScores(scores);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroup();
  }, [groupId]);

  const handleShowRequests = async () => {
    try {
      setJoinReqLoading(true);
      const { data } = await getJoinRequestByGroupId(groupId);
      setJoinRequests(data);
      setJoinReqError(null);
    } catch (err) {
      setJoinReqError(err.message);
      setJoinRequests([]);
    } finally {
      setJoinReqLoading(false);
      setShowRequestsModal(true);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-600">Cargando grupo…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <WarningModal message={error} onClose={() => setError(null)} />
      </div>
    );
  }

  // ¿es el usuario logueado el creador?
  const creatorId = group.users.find(u => u.role === "creator")?.user_id;
  const isCreator = creatorId === loggedUserId;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <NavigationBar />

      <main className="flex-grow pt-24 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{group.group_name}</h1>
          {isCreator && (
            <button
              onClick={handleShowRequests}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-green-600"
            >
              Solicitudes
            </button>
          )}
        </div>

        {/* Leaderboard */}
        <Leaderboard entries={userScores} />
      </main>

      <footer className="bg-gray-200 text-gray-700 text-center py-3 text-sm">
        <p>© 2025 PrediApp</p>
      </footer>

      {/* Modal de solicitudes */}
      {showRequestsModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Solicitudes para unirse</h2>

            {joinReqLoading ? (
              <p>Cargando...</p>
            ) : joinReqError ? (
              <p className="text-red-500">{joinReqError}</p>
            ) : (
              <ul className="list-disc list-inside space-y-1 mb-4">
                {joinRequests.length > 0 ? (
                  joinRequests.map(username => (
                    <li key={username}>{username}</li>
                  ))
                ) : (
                  <li>No hay solicitudes pendientes.</li>
                )}
              </ul>
            )}

            <button
              onClick={() => setShowRequestsModal(false)}
              className="mt-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupPage;
