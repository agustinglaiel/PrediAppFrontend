import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

const NavigationBar = () => {
  const location = useLocation();
  const [visible, setVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const isTop = currentScrollPos < 10;
      const isScrollingUp = prevScrollPos > currentScrollPos;

      setVisible(isTop || isScrollingUp);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  const navItems = [
    { path: "/", label: "inicio" },
    { path: "/pronosticos", label: "prónosticos" },
    { path: "/grupos", label: "grupos" },
    { path: "/resultados", label: "resultados" },
  ];

  return (
    <div
      className={`px-6 fixed w-full z-40 transition-all duration-300 ${
        visible ? "top-20 opacity-100" : "-top-20 opacity-0"
      }`}
    >
      <nav className="bg-gray-100 rounded-lg shadow-sm max-w-md mx-auto">
        <div className="px-2 py-1 flex justify-around items-center">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  isActive ||
                  (item.path === "/pronosticos" &&
                    location.pathname.startsWith("/pronosticos"))
                    ? "text-red-600 bg-gray-200"
                    : "text-gray-700 hover:text-red-600"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default NavigationBar;
