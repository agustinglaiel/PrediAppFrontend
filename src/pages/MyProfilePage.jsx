// src/pages/MyProfilePage.jsx
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams }     from "react-router-dom";
import Header                          from "../components/Header";
import NavigationBar                   from "../components/NavigationBar";
import MessageStatus                   from "../components/MessageStatus";
import { AuthContext }                 from "../contexts/AuthContext";
import useUser                         from "../hooks/useUser";
import UserCardInfo                    from "../components/UserCardInfo";
import { updateUserById, uploadProfilePicture } from "../api/users";

const MyProfilePage = () => {
  const { user: authUser, isAuthenticated, loading: authLoading } =
    useContext(AuthContext);
  const { userId: paramId } = useParams();
  const userId = Number(paramId);
  const sameUser = isAuthenticated && authUser?.id === userId;
  const navigate = useNavigate();

  // Estados para mensajes
  const [msgText, setMsgText]     = useState("");
  const [msgStatus, setMsgStatus] = useState(200);

  // redirecciones seguras
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    } else if (!sameUser) {
      navigate(`/profile/${authUser.id}`, { replace: true });
    }
  }, [authLoading, isAuthenticated, sameUser, authUser, navigate]);

  // datos de usuario
  const { user, loading: userLoading, error: userError } =
    useUser(sameUser ? userId : null);

  const [profile, setProfile] = useState(null);
  useEffect(() => {
    if (user) setProfile(user);
  }, [user]);

  // SUBIDA DE IMAGEN: sólo actualiza preview tras éxito, y muestra error
  const handleImageUpload = async file => {
    try {
      const res = await uploadProfilePicture(authUser.id, file);
      // construyo dataURL local para el preview
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.onerror = () => reject(new Error("Reader error"));
        reader.readAsDataURL(file);
      });
      setProfile(p => ({ ...p, profileImageUrl: dataUrl }));
      setMsgStatus(200);
      setMsgText("Imagen actualizada correctamente");
    } catch (err) {
      // rollback preview automático: no tocamos profileImageUrl
      setMsgStatus(err.status || 500);
      setMsgText(err.message || "Error subiendo la imagen");
    }
  };

  // GUARDAR CAMBIOS (texto): muestra mensaje en verde/rojo
  const handleSave = async updated => {
    try {
      await updateUserById(authUser.id, {
        first_name:   updated.firstName,
        last_name:    updated.lastName,
        username:     updated.username,
        email:        updated.email,
        phone_number: updated.phoneNumber,
      });
      setProfile(p => ({ ...p, ...updated }));
      setMsgStatus(200);
      setMsgText("Perfil actualizado correctamente");
    } catch (err) {
      setMsgStatus(err.status || 500);
      setMsgText(err.message);
    }
  };

  if (authLoading || !sameUser) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <NavigationBar />

      <main className="flex-grow pt-16 px-4 text-center">
        {userLoading && <p>Cargando perfil…</p>}
        {userError && (
          <p className="text-red-600">Error: {userError.message}</p>
        )}
        {!userLoading && profile && (
          <UserCardInfo
            user={profile}
            onSave={handleSave}
            onImageUpload={handleImageUpload}
          />
        )}
      </main>

      <footer className="bg-gray-200 text-gray-700 text-center py-3 text-sm">
        <p>© 2025 PrediApp</p>
      </footer>

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
