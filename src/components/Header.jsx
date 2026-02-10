// src/components/Header.jsx
import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SignOutAlert from "./SignOutAlert";
// import { logout } from "../api/users";
import { AuthContext } from "../contexts/AuthContext";
import useStoredScore from "../hooks/useStoredScore";

const Header = () => {
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();

  // Usuario desde contexto (no pegamos a backend para el header)
  const { user: authUser, isAuthenticated, logout } = useContext(AuthContext);
  const displayUser = authUser ?? null;

  // Score desde localStorage (sin latencia y sincronizado entre pestañas)
  const storedScore = useStoredScore();

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
    const val = Number.isFinite(storedScore) ? storedScore : 0;
    return `${val} Puntos`;
  })();

  return (
    <div className="relative">
      <header
        className={`fixed top-0 left-0 w-full h-14 z-50 transition-all duration-300 ease-in-out ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        } bg-gradient-to-r from-red-700 via-red-600 to-red-700 backdrop-blur-md border-b border-white/10 shadow-[0_2px_20px_rgba(0,0,0,0.15)]`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          {/* Logo y título */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2.5 group"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-white/10 rounded-xl blur-sm group-hover:bg-white/20 transition-all duration-300" />
              <img
                src="/images/logo.png"
                alt="Logo"
                className="relative h-8 w-auto object-contain drop-shadow-md"
              />
            </div>
            <span className="text-white text-xl md:text-2xl font-extrabold tracking-tight drop-shadow-sm">
              Predi
            </span>
          </button>

          {/* Score y menú */}
          <div className="flex items-center h-full gap-3 relative">
            {isAuthenticated && displayUser ? (
              <>
                {scoreText && (
                  <div className="hidden sm:flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 border border-white/15">
                    <svg
                      className="w-3.5 h-3.5 text-yellow-300"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-white text-xs font-semibold tabular-nums">
                      {scoreText}
                    </span>
                  </div>
                )}

                <div className="relative" ref={menuRef}>
                  <button
                    onClick={toggleMenu}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/15 rounded-full pl-1.5 pr-2.5 py-1 shadow-sm transition-all duration-200 group"
                    title="Menú usuario"
                  >
                    {/* Avatar */}
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-white/30 to-white/10 flex items-center justify-center text-xs font-bold text-white uppercase shadow-inner ring-1 ring-white/20">
                      {displayUser.username?.charAt(0) || "U"}
                    </div>
                    <span
                      className="hidden sm:block text-white text-sm font-medium truncate max-w-[90px]"
                      title={displayUser.username}
                    >
                      {displayUser.username}
                    </span>
                    <svg
                      className={`w-3.5 h-3.5 text-white/70 transition-transform duration-200 ${
                        showMenu ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Dropdown */}
                  {showMenu && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl ring-1 ring-black/5 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      {/* Score visible en mobile dentro del dropdown */}
                      {scoreText && (
                        <div className="sm:hidden px-4 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                          <svg
                            className="w-4 h-4 text-yellow-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-sm font-semibold text-gray-700">
                            {scoreText}
                          </span>
                        </div>
                      )}

                      <div className="py-1">
                        {displayUser.role === "admin" && (
                          <button
                            onClick={onClickAdmin}
                            className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors duration-150"
                          >
                            <svg className="w-4 h-4 opacity-60" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Panel admin
                          </button>
                        )}
                        <button
                          onClick={onClickProfile}
                          className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors duration-150"
                        >
                          <svg className="w-4 h-4 opacity-60" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                          </svg>
                          Mi Perfil
                        </button>
                      </div>

                      <div className="border-t border-gray-100">
                        <button
                          onClick={onClickSignOut}
                          className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors duration-150"
                        >
                          <svg className="w-4 h-4 opacity-60" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                          </svg>
                          Cerrar Sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="bg-white text-red-700 font-semibold text-sm rounded-full px-5 py-1.5 shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-200"
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
