import React from "react";
import Header from "../components/Header";
// import NavigationBar from "../components/NavigationBar";
import {
  FiUsers,
  FiCalendar,
  FiBarChart2,
  FiUser,
  FiTarget,
  FiChevronRight,
} from "react-icons/fi";

const tiles = [
  {
    title: "Gestionar Usuarios",
    description: "Roles, permisos y cuentas.",
    href: "/admin/users",
    icon: FiUsers,
    iconBg: "bg-blue-50 group-hover:bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    title: "Gestionar Sesiones",
    description: "Calendario y configuraciones.",
    href: "/admin/sessions",
    icon: FiCalendar,
    iconBg: "bg-violet-50 group-hover:bg-violet-100",
    iconColor: "text-violet-600",
  },
  {
    title: "Gestionar Resultados",
    description: "Carga, edición y validaciones.",
    href: "/admin/results",
    icon: FiBarChart2,
    iconBg: "bg-emerald-50 group-hover:bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    title: "Gestionar Pilotos",
    description: "Listado, datos y estados.",
    href: "/admin/drivers",
    icon: FiUser,
    iconBg: "bg-orange-50 group-hover:bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    title: "Gestionar Pronósticos",
    description: "Reglas, scoring y control.",
    href: "/admin/prodes",
    icon: FiTarget,
    iconBg: "bg-rose-50 group-hover:bg-rose-100",
    iconColor: "text-rose-600",
  },
];

const AdminDashboardPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 text-gray-900">
      <Header />
      {/* <NavigationBar /> */}

      <main className="pt-28 pb-10 px-4">
        <section className="max-w-6xl mx-auto">
          <div className="rounded-3xl border border-gray-200 bg-white/80 backdrop-blur shadow-sm">
            <div className="px-6 py-8 sm:px-10 sm:py-10">
              {/* Title */}
              <div className="flex flex-col items-center text-center gap-3">
                <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
                  Panel de Administración
                </h1>
              </div>

              {/* Grid */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tiles.map((t) => {
                  const Icon = t.icon;
                  return (
                    <a
                      key={t.href}
                      href={t.href}
                      className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200
                                 hover:-translate-y-0.5 hover:shadow-md hover:border-gray-300
                                 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20"
                    >
                      {/* subtle highlight */}
                      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-gray-900/5 blur-2xl" />
                      </div>

                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200
                                      ${t.iconBg} transition-colors duration-200`}
                        >
                          <Icon className={`h-5 w-5 ${t.iconColor}`} />
                        </div>

                        {/* Text */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <h2 className="truncate text-base font-semibold text-gray-900">
                              {t.title}
                            </h2>
                            <FiChevronRight className="h-4 w-4 text-gray-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-gray-600" />
                          </div>
                          <p className="mt-1 text-sm text-gray-600">
                            {t.description}
                          </p>
                        </div>
                      </div>

                      {/* Accent line */}
                      <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent group-hover:via-gray-300 transition-colors" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 text-center text-sm text-gray-500">
          © 2026 PrediApp
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboardPage;
