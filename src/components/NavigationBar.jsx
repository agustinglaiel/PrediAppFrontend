import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  IoHomeOutline,
  IoHome,
  IoFlagOutline,
  IoFlag,
  IoTrophyOutline,
  IoTrophy,
  IoStatsChartOutline,
  IoStatsChart,
  IoPeopleOutline,
  IoPeople,
} from "react-icons/io5";

const NavigationBar = () => {
  const location = useLocation();

  const navItems = [
    {
      path: "/",
      label: "Inicio",
      icon: <IoHomeOutline className="text-[22px]" />,
      activeIcon: <IoHome className="text-[22px]" />,
    },
    {
      path: "/resultados",
      label: "Resultados",
      icon: <IoFlagOutline className="text-[22px]" />,
      activeIcon: <IoFlag className="text-[22px]" />,
    },
    {
      path: "/clasificacion",
      label: "Clasificación",
      icon: <IoTrophyOutline className="text-[22px]" />,
      activeIcon: <IoTrophy className="text-[22px]" />,
    },
    {
      path: "/ranking",
      label: "Ranking",
      icon: <IoStatsChartOutline className="text-[22px]" />,
      activeIcon: <IoStatsChart className="text-[22px]" />,
    },
    {
      path: "/grupos",
      label: "Grupos",
      icon: <IoPeopleOutline className="text-[22px]" />,
      activeIcon: <IoPeople className="text-[22px]" />,
    },
  ];

  const isItemActive = (itemPath) => {
    if (itemPath === "/") return location.pathname === "/";
    return location.pathname.startsWith(itemPath);
  };

  return (
    <div className="fixed bottom-0 w-full z-40 bg-gray-800 text-white">
      <nav className="max-w-md mx-auto flex justify-around items-center p-2">
        {navItems.map((item) => {
          const active = isItemActive(item.path);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center px-3 py-1 text-xs rounded-md transition-colors duration-200 ${
                active
                  ? "text-red-400"
                  : "text-gray-400 hover:text-white"
              }`}
              title={item.label}
            >
              {active ? item.activeIcon : item.icon}
              <span className={`mt-0.5 ${active ? "font-semibold" : ""}`}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default NavigationBar;
