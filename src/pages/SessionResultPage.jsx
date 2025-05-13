// src/pages/SessionResultPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Header from "../components/Header";
import NavigationBar from "../components/NavigationBar";
import SessionHeader from "../components/pronosticos/SessionHeader";
import ResultGrid from "../components/results/ResultGrid";
import { getResultsOrderedByPosition } from "../api/results";

const SessionResultPage = () => {
  const { sessionId } = useParams();
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionData, setSessionData] = useState(null);

  useEffect(() => {
    const fetchSessionResults = async () => {
      try {
        setLoading(true);
        setError(null);

        // Obtener datos de la sesión desde location.state (pasados desde ResultsPage)
        if (location.state) {
          setSessionData(location.state);
        } else {
          throw new Error("No se encontraron datos de la sesión.");
        }

        // Obtener resultados de la sesión
        const data = await getResultsOrderedByPosition(sessionId);
        setResults(data);
      } catch (err) {
        setError("Error al cargar los resultados: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionResults();
  }, [sessionId, location.state]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-600">Cargando resultados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!sessionData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-600">No se encontraron datos de la sesión.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <NavigationBar />
      <main className="flex-grow pt-24 px-4 mb-4">
        <div className="mt-12">
          <SessionHeader
            countryName={sessionData.countryName || "Unknown"}
            flagUrl={sessionData.flagUrl || "/images/flags/default.jpg"}
            sessionName={sessionData.sessionName || "Unknown Session"}
            sessionType={sessionData.sessionType || "Unknown Type"}
            className="mb-4"
          />
          <ResultGrid results={results} />
        </div>
      </main>
      <footer className="bg-gray-200 text-gray-700 text-center py-3 text-sm">
        <p>© 2025 PrediApp</p>
      </footer>
    </div>
  );
};

export default SessionResultPage;
