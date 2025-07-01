// src/components/Header.jsx
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SignOutAlert from "./SignOutAlert";
import { logout } from "../api/users";
import { AuthContext } from "../contexts/AuthContext";

const Header = () => {
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext);

  // Efecto para manejar el scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Solo ocultar/mostrar si hay un scroll significativo (más de 10px)
      if (Math.abs(currentScrollY - lastScrollY) < 10) {
        return;
      }

      // Si estamos cerca del top (menos de 100px), siempre mostrar
      if (currentScrollY < 100) {
        setIsVisible(true);
      } else {
        // Si scrolleamos hacia abajo, ocultar. Si hacia arriba, mostrar
        setIsVisible(currentScrollY < lastScrollY);
      }

      setLastScrollY(currentScrollY);
    };

    // Throttle para mejorar performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledHandleScroll);

    return () => window.removeEventListener("scroll", throttledHandleScroll);
  }, [lastScrollY]);

  const handleUsernameClick = () => {
    if (isAuthenticated) {
      setShowSignOutModal(true);
    } else {
      navigate("/login");
    }
  };

  const confirmSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error during sign out:", error);
    } finally {
      setShowSignOutModal(false);
      navigate("/");
      window.location.reload();
    }
  };

  const closeSignOutModal = () => setShowSignOutModal(false);

  return (
    <div className="relative">
      <header
        className={`bg-red-700 text-white fixed top-0 left-0 w-full h-16 z-50 shadow-md transition-transform duration-300 ease-in-out ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          {/* Logo y título */}
          <div className="flex items-center h-full">
            <img
              src="/images/logo.png"
              alt="Logo"
              className="h-8 w-auto object-contain"
            />
            <button
              onClick={() => navigate("/")}
              className="ml-2 text-2xl md:text-3xl font-bold leading-none"
            >
              Predi
            </button>
          </div>

          {/* Score y Username */}
          <div className="flex items-center h-full space-x-6">
            {isAuthenticated && user && (
              <>
                {/* Score como texto plano */}
                <span className="text-sm font-semibold">
                  {typeof user.score === "number" ? user.score : 0} Puntos
                </span>

                {/* Username con recuadro y flecha */}
                <button
                  onClick={handleUsernameClick}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-1.5 shadow-sm flex items-center space-x-1 text-sm font-semibold hover:bg-white/15 transition-colors duration-200"
                  title="Cerrar sesión"
                >
                  <span>{user.username}</span>
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </>
            )}

            {!isAuthenticated && (
              <button
                onClick={() => navigate("/login")}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-1.5 shadow-sm text-sm font-semibold hover:bg-white/15 transition-colors duration-200"
              >
                Ingresar
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Modal de confirmación */}
      <SignOutAlert
        isOpen={showSignOutModal}
        onClose={closeSignOutModal}
        onConfirm={confirmSignOut}
      />
    </div>
  );
};

export default Header;
