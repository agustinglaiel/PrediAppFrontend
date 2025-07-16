// src/pages/MyProfilePage.jsx
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import NavigationBar from "../components/NavigationBar";
import { AuthContext } from "../contexts/AuthContext";
import useUser from "../hooks/useUser";
import UserCardInfo from "../components/UserCardInfo";
import { updateUserById } from "../api/users";

const MyProfilePage = () => {
  const { user: authUser, isAuthenticated, loading: authLoading } =
    useContext(AuthContext);

  const { userId: paramId } = useParams();
  const userId = Number(paramId);
  const sameUser = isAuthenticated && authUser?.id === userId;
  const navigate = useNavigate();

  /* ─── 1) Redirecciones seguras ─────────────────────────── */
  useEffect(() => {
    if (authLoading) return;                    // espera contexto
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }
    if (!sameUser) {
      navigate(`/profile/${authUser.id}`, { replace: true });
    }
  }, [authLoading, isAuthenticated, sameUser, authUser, navigate]);

  /* ─── 2) Traer datos ───────────────────────────────────── */
  const { user, loading: userLoading, error } = useUser(sameUser ? userId : null);
  const [profile, setProfile] = useState(null);

  // copia de trabajo local cada vez que llega del hook
  useEffect(() => {
    if (user) setProfile({
      firstName:       user.first_name,
      lastName:        user.last_name,
      username:        user.username,
      email:           user.email,
      score:           user.score,
      phoneNumber:     user.phone_number,
      profileImageUrl: user.avatar_url,
    });
  }, [user]);

  /* ─── 3) Guardar cambios ───────────────────────────────── */
  const handleSave = async (updated) => {
    try {
      await updateUserById(authUser.id, {
        first_name:   updated.firstName,
        last_name:    updated.lastName,
        email:        updated.email,
        phone_number: updated.phoneNumber,
      });
      setProfile(updated);
      alert("Perfil actualizado correctamente.");
    } catch (err) {
      alert(err.message);
    }
  };

  /* ─── 4) Loading & Error globales ──────────────────────── */
  if (authLoading || !sameUser) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <NavigationBar />

      <main className="flex-grow pt-16 px-4 text-center">
        {userLoading && <p>Cargando perfil…</p>}
        {error && <p className="text-red-600">Error: {error.message}</p>}
        {!userLoading && profile && (
          <UserCardInfo user={profile} onSave={handleSave} />
        )}
      </main>

      <footer className="bg-gray-200 text-gray-700 text-center py-3 text-sm">
        <p>© 2025 PrediApp</p>
      </footer>
    </div>
  );
};

export default MyProfilePage;
