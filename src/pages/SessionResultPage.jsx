import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Header from "../components/Header";
import NavigationBar from "../components/NavigationBar";
import SessionHeader from "../components/pronosticos/SessionHeader";
import ResultGrid from "../components/results/ResultGrid";
import MissingResults from "../components/results/MissingResults";
import { getResultsOrderedByPosition } from "../api/results";

const SessionResultPage = () => {
  const { sessionId } = useParams();
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionData, setSessionData] = useState(null);
  const [isMissingResultsOpen, setIsMissingResultsOpen] = useState(false);

  useEffect(() => {
    const fetchSessionResults = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getResultsOrderedByPosition(sessionId);
        setResults(data.results || []);

        // Usar datos de la sesión del backend, con fallback a location.state
        if (data.session) {
          setSessionData({
            countryName: data.session.country_name || location.state?.countryName,
            flagUrl: data.session.country_name
              ? `/images/flags/${data.session.country_name.toLowerCase()}.jpg`
              : location.state?.flagUrl || "/images/flags/default.jpg",
            sessionName: data.session.session_name || location.state?.sessionName,
            sessionType: data.session.session_type || location.state?.sessionType,
          });
        } else if (location.state) {
          setSessionData(location.state);
        } else {
          throw new Error("No se encontraron datos de la sesión.");
        }
      } catch (err) {
        if (
          err.message?.includes("No results found") ||
          err.status === 404 ||
          err.message?.includes("No results found for this session")
        ) {
          setIsMissingResultsOpen(true);
        } else {
          setError("Error al cargar los resultados: " + err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSessionResults();
  }, [sessionId, location.state]);

  // Si el modal está abierto, solo renderizamos el modal
  if (isMissingResultsOpen) {
    return (
      <MissingResults
        isOpen={isMissingResultsOpen}
        onClose={() => setIsMissingResultsOpen(false)}
      />
    );
  }

  // Renderizamos el estado de carga
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 gap-3">
        <div className="w-8 h-8 border-3 border-gray-200 border-t-red-500 rounded-full animate-spin" />
        <p className="text-gray-500 text-sm font-medium">Cargando resultados...</p>
      </div>
    );
  }

  // Renderizamos el estado de error
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  // Renderizamos el caso de datos de sesión no disponibles
  if (!sessionData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-600">No se encontraron datos de la sesión.</p>
      </div>
    );
  }

  // Renderizamos la UI completa si no hay modal abierto
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <NavigationBar />
      <main className="flex-grow pt-12 pb-24 px-4">
        <div className="max-w-2xl mx-auto mt-8">
          <SessionHeader
            countryName={sessionData.countryName || "Unknown"}
            flagUrl={sessionData.flagUrl || "/images/flags/default.jpg"}
            sessionName={sessionData.sessionName || "Unknown Session"}
            sessionType={sessionData.sessionType || "Unknown Type"}
            className="mb-5"
          />

          {/* Título de la tabla */}
          <div className="flex items-center gap-2 mb-3 px-1">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Clasificación
            </h3>
            <div className="flex-grow h-px bg-gray-200" />
          </div>

          <ResultGrid
            results={results}
            sessionType={sessionData.sessionType || "Unknown Type"}
            sessionName={sessionData.sessionName || "Unknown Session"}
          />
        </div>
      </main>
    </div>
  );
};

export default SessionResultPage;
