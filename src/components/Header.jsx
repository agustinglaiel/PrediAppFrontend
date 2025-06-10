import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SignOutAlert from "./SignOutAlert";
import { logout } from "../api/users";

const Header = () => {
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("jwtToken");

  const handleLogoClick = () => {
    if (isAuthenticated) {
      setShowSignOutModal(true);
    } else {
      navigate("/login");
    }
  };

  const confirmSignOut = async () => {
    try {
      await logout();
      setShowSignOutModal(false);
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Error during sign out:", error.message);
      setShowSignOutModal(false);
      navigate("/");
      window.location.reload();
    }
  };

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
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          {/* Logo y texto "predi" a la izquierda */}
          <div className="flex items-center h-full">
            <img
              src="/images/logo.png"
              alt="Logo"
              className="h-8 w-auto object-contain flex-shrink-0"
            />
            <Link
              to="/"
              className="text-2xl md:text-3xl font-bold tracking-wide ml-2 pointer-events-auto leading-none"
              onClick={() => navigate("/")}
            >
              predi
            </Link>
          </div>

          {/* Puntos y Logo como botón de Log In/Sign Out (right) */}
          <div className="flex items-center h-full space-x-3">
            {/* Rectángulo de puntos */}
            {isAuthenticated && (
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-1.5 shadow-sm">
                <div className="flex items-center space-x-1.5">
                  <div className="w-2 h-2 bg-white rounded-full shadow-sm"></div>
                  <span className="text-sm font-semibold text-white">
                    120 Puntos
                  </span>
                </div>
              </div>
            )}

            {/* Rectángulo de usuario con flecha */}
            <button
              onClick={handleLogoClick}
              className="focus:outline-none hover:scale-105 transition-transform duration-200"
              title={isAuthenticated ? "Sign Out" : "Log In"}
            >
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-1.5 shadow-sm hover:bg-white/15 transition-colors duration-200">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-white">
                    {isAuthenticated ? "User" : "Log In"}
                  </span>
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
                </div>
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
