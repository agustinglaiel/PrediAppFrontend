import React, { useContext } from "react";
import Header from "../components/Header";
import NavigationBar from "../components/NavigationBar";
import { AuthContext } from "../contexts/AuthContext";
import useUser from "../hooks/useUser";
import UserCardInfo from "../components/UserCardInfo";

const MyProfilePage = () => {
  const { user: authUser } = useContext(AuthContext);
  const userId = authUser?.id;
  const { user, loading, error } = useUser(userId);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <NavigationBar />

      <main className="flex-grow pt-16 px-4 text-center">
        {loading && <p>Cargando perfil…</p>}
        {error && <p className="text-red-600">Error: {error.message}</p>}
        {!loading && !error && user && (
          <UserCardInfo user={{
            firstName:    user.first_name,
            lastName:     user.last_name,
            username:     user.username,
            email:        user.email,
            score:        user.score,
            phoneNumber:  user.phone_number,
            profileImageUrl: user.avatar_url  // o la ruta a tu endpoint que sirva ImagenPerfil
          }} />
        )}
      </main>

      <footer className="bg-gray-200 text-gray-700 text-center py-3 text-sm">
        <p>© 2025 PrediApp</p>
      </footer>
    </div>
  );
};

export default MyProfilePage;
