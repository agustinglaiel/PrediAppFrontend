import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  IoIosHome,
  IoIosStats,
  IoIosPeople,
  IoIosFlag,
  IoIosChatboxes,
} from "react-icons/io";

const NavigationBar = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Inicio", icon: <IoIosHome className="text-xl" /> },
    {
      path: "/ranking",
      label: "Ranking",
      icon: <IoIosStats className="text-xl" />,
    },
    {
      path: "/grupos",
      label: "Grupos",
      icon: <IoIosPeople className="text-xl" />,
    },
    {
      path: "/resultados",
      label: "Resultados",
      icon: <IoIosFlag className="text-xl" />,
    },
    {
      path: "/foro",
      label: "Foro",
      icon: <IoIosChatboxes className="text-xl" />,
    },
  ];

  return (
    <div className="fixed bottom-0 w-full z-40 bg-gray-800 text-white">
      <nav className="max-w-md mx-auto flex justify-around items-center p-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center px-3 py-1 text-xs rounded-md transition-colors duration-200 ${
                isActive ||
                (item.path === "/pronosticos" &&
                  location.pathname.startsWith("/pronosticos"))
                  ? "text-red-400"
                  : "text-gray-300 hover:text-white"
              }`
            }
            title={item.label}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default NavigationBar;
