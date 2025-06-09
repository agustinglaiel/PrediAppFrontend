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

        if (location.state) {
          setSessionData(location.state);
        } else {
          throw new Error("No se encontraron datos de la sesión.");
        }

        const data = await getResultsOrderedByPosition(sessionId);
        setResults(data);
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
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-600">Cargando resultados...</p>
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
      <main className="flex-grow pt-12 px-4 mb-8">
        <div className="mt-12">
          <SessionHeader
            countryName={sessionData.countryName || "Unknown"}
            flagUrl={sessionData.flagUrl || "/images/flags/default.jpg"}
            sessionName={sessionData.sessionName || "Unknown Session"}
            sessionType={sessionData.sessionType || "Unknown Type"}
            className="mb-4"
          />
          <ResultGrid
            results={results}
            sessionType={sessionData.sessionType || "Unknown Type"}
            sessionName={sessionData.sessionName || "Unknown Session"}
          />
        </div>
      </main>
      <footer className="bg-gray-200 text-gray-700 text-center py-3 text-sm">
        <p>© 2025 PrediApp</p>
      </footer>
    </div>
  );
};

export default SessionResultPage;
