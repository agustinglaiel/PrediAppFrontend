// src/components/Header.jsx
import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SignOutAlert from "./SignOutAlert";
import { logout } from "../api/users";
import { AuthContext } from "../contexts/AuthContext";
import useUser from "../hooks/useUser";

const Header = () => {
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();

  // Renombro para evitar sombra de variables
  const { user: authUser, isAuthenticated } = useContext(AuthContext);

  // Traigo el usuario "vivo" desde backend
  const { user: freshUser, loading: userLoading, error: userError } = useUser(authUser?.id);

  // Usuario que se muestra: prefiero el fresco; si aún carga o falla, uso el del contexto
  const displayUser = freshUser ?? authUser ?? null;

  const menuRef = useRef(null);

  // Manejo de scroll para mostrar/ocultar header (sin cambios)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (Math.abs(currentScrollY - lastScrollY) < 10) return;
      if (currentScrollY < 100) {
        setIsVisible(true);
      } else {
        setIsVisible(currentScrollY < lastScrollY);
      }
      setLastScrollY(currentScrollY);
    };
    let ticking = false;
    const throttled = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", throttled);
    return () => window.removeEventListener("scroll", throttled);
  }, [lastScrollY]);

  // Cerrar menú al hacer click fuera (sin cambios)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  const toggleMenu = () => setShowMenu((prev) => !prev);

  const onClickProfile = () => {
    setShowMenu(false);
    if (displayUser?.id) navigate(`/profile/${displayUser.id}`);
  };

  const onClickSignOut = () => {
    setShowMenu(false);
    setShowSignOutModal(true);
  };

  const onClickAdmin = () => {
    setShowMenu(false);
    navigate("/admin");
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

  // Helpers de UI
  const scoreText = (() => {
    if (!isAuthenticated || !displayUser) return null;
    if (userLoading) return "Actualizando…";
    // Si no es número, muestro 0 por seguridad
    const val = typeof displayUser.score === "number" ? displayUser.score : 0;
    return `${val} Puntos`;
  })();

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

          {/* Score y menú */}
          <div className="flex items-center h-full space-x-6 relative">
            {isAuthenticated && displayUser ? (
              <>
                {scoreText && (
                  <span className="text-sm font-semibold">
                    {scoreText}
                  </span>
                )}

                <div className="relative" ref={menuRef}>
                  <button
                    onClick={toggleMenu}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-1.5 shadow-sm flex items-center space-x-1 text-sm font-semibold hover:bg-white/15 transition-colors duration-200"
                    title="Menú usuario"
                  >
                    <div
                      className="overflow-hidden truncate max-w-[80px]"
                      style={{ minWidth: 0 }}
                      title={displayUser.username}
                    >
                      {displayUser.username}
                    </div>
                    <svg
                      className={`w-4 h-4 text-white transition-transform duration-200 ${
                        showMenu ? "rotate-180" : ""
                      }`}
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

                  {/* Dropdown */}
                  {showMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white backdrop-blur-sm border border-white/20 rounded-lg shadow-lg z-50 overflow-hidden">
                      {displayUser.role === "admin" && (
                        <button
                          onClick={onClickAdmin}
                          className="block w-full text-left px-3 py-1.5 text-sm font-semibold text-black hover:bg-gray-100 transition-colors duration-200"
                        >
                          Panel admin
                        </button>
                      )}
                      <button
                        onClick={onClickProfile}
                        className="block w-full text-left px-3 py-1.5 text-sm font-semibold text-black hover:bg-gray-100 transition-colors duration-200"
                      >
                        Mi Perfil
                      </button>
                      <button
                        onClick={onClickSignOut}
                        className="block w-full text-left px-3 py-1.5 text-sm font-semibold text-black hover:bg-gray-100 transition-colors duration-200"
                      >
                        Cerrar Sesión
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
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

      <SignOutAlert
        isOpen={showSignOutModal}
        onClose={() => setShowSignOutModal(false)}
        onConfirm={confirmSignOut}
      />
    </div>
  );
};

export default Header;
