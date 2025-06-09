import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SignOutAlert from "./SignOutAlert";
import { logout } from "../api/users";

const Header = () => {
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const navigate = useNavigate();

  // Verificar si el usuario está autenticado
  const isAuthenticated = !!localStorage.getItem("jwtToken");

  // Función para manejar el clic en el logo
  const handleLogoClick = () => {
    if (isAuthenticated) {
      setShowSignOutModal(true); // Mostrar el modal si está autenticado
    } else {
      navigate("/login"); // Redirigir a login si no está autenticado
    }
  };

  // Función para confirmar el cierre de sesión
  const confirmSignOut = async () => {
    try {
      await logout(); // Llamamos a la función logout de users.jsx
      setShowSignOutModal(false);
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Error during sign out:", error.message);
      // Aunque falle el logout en el backend, el localStorage ya se limpió
      setShowSignOutModal(false);
      navigate("/");
      window.location.reload();
    }
  };

  // Función para cerrar el modal sin acción
  const closeSignOutModal = () => {
    setShowSignOutModal(false);
  };

  const Link = ({ to, children, className, onClick }) => (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );

  return (
    <div className="relative">
      <header className="bg-red-700 text-white w-full z-50 shadow-md fixed top-0 left-0 mb-3 h-16">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo/Texto "PREDI" (center) */}
          <div className="flex-1"></div>
          <div className="pointer-events-none">
            <Link
              to="/"
              className="text-2xl md:text-3xl font-bold tracking-wide pointer-events-auto"
              onClick={() => navigate("/")}
            >
              PREDI
            </Link>
          </div>
          <div className="flex-1 flex justify-end">
            {/* Logo como botón de Log In/Sign Out (right) */}
            <button
              onClick={handleLogoClick}
              className="focus:outline-none flex items-center justify-center"
              title={isAuthenticated ? "Sign Out" : "Log In"}
            >
              <div className="w-9 h-9 rounded-full overflow-hidden">
                <img
                  src="/images/user-logo.jpg"
                  alt={isAuthenticated ? "Sign Out" : "Log In"}
                  className="w-full h-full object-contain"
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Modal de confirmación de Sign Out */}
      <SignOutAlert
        isOpen={showSignOutModal}
        onClose={closeSignOutModal}
        onConfirm={confirmSignOut}
      />
    </div>
  );
};

export default Header;
