import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import NavigationBar from "../components/NavigationBar";
import SessionHeader from "../components/pronosticos/SessionHeader"; // Importamos el componente

const SessionResult = () => {
  const { sessionId } = useParams(); // Obtenemos el sessionId de la URL
  const navigate = useNavigate();
  const location = useLocation(); // Para obtener los datos pasados en el state
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionData, setSessionData] = useState(null); // Almacenamos los datos de la sesión

  useEffect(() => {
    // Obtenemos los datos de la sesión desde location.state
    if (location.state) {
      setSessionData(location.state);
    }

    const fetchResults = async () => {
      try {
        setLoading(true);
        // Aquí iría la llamada a una API, por ejemplo: await getSessionResults(sessionId)
        // Por ahora, usamos datos ficticios
        const dummyResults = Array.from({ length: 20 }, (_, index) => ({
          position: index < 18 ? index + 1 : "DNF",
          driver: `Driver ${index + 1}`,
          team: `Team ${Math.ceil((index + 1) / 2)}`,
        }));
        setResults(dummyResults);
      } catch (err) {
        setError("Error al cargar los resultados: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
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

  // Si no hay datos de la sesión, mostramos un fallback
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
            countryName={sessionData.countryName}
            flagUrl={sessionData.flagUrl}
            sessionName={sessionData.sessionName}
            sessionType={sessionData.sessionType}
            className="mb-4" // Margen inferior para separar del contenido
          />
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b text-left">POS</th>
                  <th className="py-2 px-4 border-b text-left">DRIVER</th>
                  <th className="py-2 px-4 border-b text-left">TEAM</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{result.position}</td>
                    <td className="py-2 px-4 border-b">{result.driver}</td>
                    <td className="py-2 px-4 border-b">{result.team}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <footer className="bg-gray-200 text-gray-700 text-center py-3 text-sm">
        <p>© 2025 PrediApp</p>
      </footer>
    </div>
  );
};

export default SessionResult;
