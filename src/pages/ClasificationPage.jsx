// src/pages/ClasificationPage.jsx
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import NavigationBar from "../components/NavigationBar";
import { getDriversClassification, getTeamsClassification } from "../api/results";

const ClasificationPage = () => {
  const [activeTab, setActiveTab] = useState("drivers");
  const [driversData, setDriversData] = useState([]);
  const [teamsData, setTeamsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchClassifications = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [drivers, teams] = await Promise.all([
          getDriversClassification(currentYear),
          getTeamsClassification(currentYear),
        ]);
        
        // El backend devuelve arrays directamente
        setDriversData(Array.isArray(drivers) ? drivers : []);
        setTeamsData(Array.isArray(teams) ? teams : []);
      } catch (err) {
        console.error("Error fetching classifications:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClassifications();
  }, [currentYear]);

  const renderDriversTable = () => {
    if (!driversData.length) {
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-100 to-gray-50 px-4 py-1.5 rounded-full mb-4 border border-gray-200/50">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-medium text-gray-600 uppercase tracking-wider">Temporada {currentYear}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Sin datos de clasificación
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Aún no hay resultados disponibles para la clasificación de pilotos de esta temporada
          </p>
          <div className="mt-6 flex items-center justify-center gap-2">
            <span className="w-8 h-0.5 bg-gradient-to-r from-transparent to-red-200 rounded-full"></span>
            <span className="w-2 h-2 bg-red-400 rounded-full"></span>
            <span className="w-8 h-0.5 bg-gradient-to-l from-transparent to-red-200 rounded-full"></span>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Pos</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Piloto</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">Equipo</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Pts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {driversData.map((driver, index) => (
                <tr key={driver.driver_id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold ${
                      index === 0 ? 'bg-yellow-100 text-yellow-700' :
                      index === 1 ? 'bg-gray-200 text-gray-700' :
                      index === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-gray-800">
                      {driver.first_name} {driver.last_name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-sm hidden sm:table-cell">{driver.team_name}</td>
                  <td className="px-4 py-3 text-center font-bold text-gray-800">{driver.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderTeamsTable = () => {
    if (!teamsData.length) {
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-100 to-gray-50 px-4 py-1.5 rounded-full mb-4 border border-gray-200/50">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-medium text-gray-600 uppercase tracking-wider">Temporada {currentYear}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Sin datos de clasificación
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Aún no hay resultados disponibles para la clasificación de constructores de esta temporada
          </p>
          <div className="mt-6 flex items-center justify-center gap-2">
            <span className="w-8 h-0.5 bg-gradient-to-r from-transparent to-red-200 rounded-full"></span>
            <span className="w-2 h-2 bg-red-400 rounded-full"></span>
            <span className="w-8 h-0.5 bg-gradient-to-l from-transparent to-red-200 rounded-full"></span>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Pos</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Equipo</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Pts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {teamsData.map((team, index) => (
                <tr key={team.team_name || index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold ${
                      index === 0 ? 'bg-yellow-100 text-yellow-700' :
                      index === 1 ? 'bg-gray-200 text-gray-700' :
                      index === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-gray-800">{team.team_name}</span>
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-gray-800">{team.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <NavigationBar />

      <main className="flex-grow pt-20 pb-24">
        {/* Selector de pestañas moderno */}
        <div className="max-w-6xl mx-auto px-4 mb-6">
          <div className="relative bg-gradient-to-br from-white to-gray-50 backdrop-blur-sm border border-white/20 shadow-xl rounded-xl p-1.5 overflow-hidden max-w-md mx-auto">
            {/* Fondo deslizante para la pestaña activa */}
            <div 
              className={`absolute top-1.5 bottom-1.5 bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow-lg transition-all duration-300 ease-in-out ${
                activeTab === "drivers" ? "left-1.5 right-1/2 mr-0.75" : "left-1/2 right-1.5 ml-0.75"
              }`}
            />
            
            <div className="relative flex">
              <button
                onClick={() => setActiveTab("drivers")}
                className={`relative flex-1 py-2.5 px-4 text-center font-semibold text-sm transition-all duration-300 ease-in-out rounded-lg ${
                  activeTab === "drivers"
                    ? "text-white"
                    : "text-gray-700 hover:text-red-600"
                }`}
              >
                <span className="relative z-10">
                  Pilotos
                </span>
              </button>
              
              <button
                onClick={() => setActiveTab("constructors")}
                className={`relative flex-1 py-2.5 px-4 text-center font-semibold text-sm transition-all duration-300 ease-in-out rounded-lg ${
                  activeTab === "constructors"
                    ? "text-white"
                    : "text-gray-700 hover:text-red-600"
                }`}
              >
                <span className="relative z-10">
                  Constructores
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Contenido según la pestaña activa */}
        <div className="px-4 max-w-4xl mx-auto">
          {loading ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <p className="text-gray-600">Cargando clasificación...</p>
            </div>
          ) : error ? (
            <div className="bg-white rounded-xl shadow-sm border border-red-100 p-8 text-center">
              <p className="text-red-600">{error}</p>
            </div>
          ) : activeTab === "drivers" ? (
            renderDriversTable()
          ) : (
            renderTeamsTable()
          )}
        </div>
      </main>
    </div>
  );
};

export default ClasificationPage;
