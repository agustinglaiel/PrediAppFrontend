// src/pages/MyProfilePage.jsx
import React, { useContext, useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import NavigationBar from "../components/NavigationBar";
import { AuthContext } from "../contexts/AuthContext";
import useUser from "../hooks/useUser";
import UserCardInfo from "../components/UserCardInfo";

const MyProfilePage = () => {
  /* ───────── contexto y params ───────────────────────────── */
  const { user: authUser, isAuthenticated, loading: authLoading } =
    useContext(AuthContext);
  const { userId: paramId } = useParams();
  const userId = Number(paramId);                // NaN si no es número
  const sameUser = isAuthenticated && authUser?.id === userId;
  const navigate = useNavigate();

  /* ───────── fetch de datos (hook SIEMPRE llamado) ───────── */
  // Si sameUser es false pasamos null → el hook no hace petición
  const { user, loading: userLoading, error } = useUser(
    sameUser ? userId : null
  );

  /* ───────── redirecciones seguras ───────────────────────── */
  useEffect(() => {
    if (authLoading) return;                 // aún cargando contexto

    if (!isAuthenticated) {                  // no autenticado → login
      navigate("/login", { replace: true });
      return;
    }

    if (!sameUser) {                         // intenta otro perfil → al suyo
      navigate(`/profile/${authUser.id}`, { replace: true });
    }
  }, [authLoading, isAuthenticated, sameUser, authUser, navigate]);

  /* ───────── estados intermedios / suspense ──────────────── */
  if (authLoading || !isAuthenticated || !sameUser) {
    return null;   // o <Spinner />
  }

  /* ───────── render principal ────────────────────────────── */
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <NavigationBar />

      <main className="flex-grow pt-16 px-4 text-center">
        {userLoading && <p>Cargando perfil…</p>}
        {error && <p className="text-red-600">Error: {error.message}</p>}
        {!userLoading && !error && user && (
          <UserCardInfo
            user={{
              firstName:       user.first_name,
              lastName:        user.last_name,
              username:        user.username,
              email:           user.email,
              score:           user.score,
              phoneNumber:     user.phone_number,
              profileImageUrl: user.avatar_url,
            }}
          />
        )}
      </main>

      <footer className="bg-gray-200 text-gray-700 text-center py-3 text-sm">
        <p>© 2025 PrediApp</p>
      </footer>
    </div>
  );
};

export default MyProfilePage;
