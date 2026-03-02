// src/pages/MyProfilePage.jsx
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import NavigationBar from "../components/NavigationBar";
import MessageStatus from "../components/MessageStatus";
import UserCardInfo from "../components/UserCardInfo";
import { AuthContext } from "../contexts/AuthContext";
import useUser from "../hooks/useUser";
import { updateUserById } from "../api/users";

const MyProfilePage = () => {
  const {
    user: authUser,
    isAuthenticated,
    loading: authLoading,
    refreshUser,
  } = useContext(AuthContext);
  const navigate = useNavigate();

  // Mensajes de estado
  const [msgText, setMsgText] = useState("");
  const [msgStatus, setMsgStatus] = useState(200);

  // Redirigir si no esta autenticado
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Traer datos completos del usuario (incluye phoneNumber, etc.)
  const {
    user: fullUser,
    loading: userLoading,
    error: userError,
  } = useUser(authUser?.id ?? null);

  // Mergear datos del AuthContext (score actualizado) con datos completos
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    if (fullUser && authUser) {
      setProfile({
        ...fullUser,
        score: authUser.score ?? fullUser.score,
      });
    }
  }, [fullUser, authUser]);

  // Guardar cambios del perfil
  const handleSave = async (updated) => {
    try {
      await updateUserById(authUser.id, {
        first_name: updated.firstName,
        last_name: updated.lastName,
        username: updated.username,
        email: updated.email,
        phone_number: updated.phoneNumber,
      });
      setProfile((p) => ({ ...p, ...updated }));
      setMsgStatus(200);
      setMsgText("Perfil actualizado correctamente");
      // Refrescar los datos del contexto global
      refreshUser();
    } catch (err) {
      console.error("Error al guardar perfil:", err);
      setMsgStatus(err.status || 500);
      setMsgText(err.message || "Error al guardar los cambios");
    }
  };

  if (authLoading || !isAuthenticated) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <NavigationBar />

      <main className="flex-grow pt-20 pb-24">
        <div className="max-w-2xl mx-auto px-4">
          {/* Loading */}
          {userLoading && (
            <div className="flex flex-col justify-center items-center gap-3 py-20">
              <div className="w-10 h-10 border-4 border-red-200 border-t-red-500 rounded-full animate-spin" />
              <p className="text-gray-500 text-sm font-medium">
                Cargando perfil...
              </p>
            </div>
          )}

          {/* Error */}
          {userError && !userLoading && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
              <p className="text-red-600 font-medium">
                Error al cargar el perfil
              </p>
              <p className="text-red-500 text-sm mt-1">
                {userError.message}
              </p>
            </div>
          )}

          {/* Perfil */}
          {!userLoading && profile && (
            <UserCardInfo user={profile} onSave={handleSave} />
          )}
        </div>
      </main>

      {/* Mensaje de estado */}
      {msgText && (
        <MessageStatus
          text={msgText}
          status={msgStatus}
          onHide={() => setMsgText("")}
        />
      )}
    </div>
  );
};

export default MyProfilePage;
