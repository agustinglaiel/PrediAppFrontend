import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import NavigationBar from "../components/NavigationBar";
import SessionHeader from "../components/pronosticos/SessionHeader";
import { getResultsOrderedByPosition } from "../api/results";

const SessionResult = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionData, setSessionData] = useState(null);

  useEffect(() => {
    if (location.state) {
      setSessionData(location.state);
    }

    const fetchResults = async () => {
      try {
        setLoading(true);
        const data = await getResultsOrderedByPosition(sessionId);
        setResults(data);
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
      <main className="flex-grow pt-24 pb-24 px-4">
        <div className="mt-12">
          <SessionHeader
            countryName={sessionData.countryName}
            flagUrl={sessionData.flagUrl}
            sessionName={sessionData.sessionName}
            sessionType={sessionData.sessionType}
            className="mb-4"
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
                {results.map((result) => (
                  <tr key={result.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">
                      {result.status === "" || result.status === "FINISHED"
                        ? result.position
                        : result.status}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {result.driver.last_name}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {result.driver.team_name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SessionResult;
