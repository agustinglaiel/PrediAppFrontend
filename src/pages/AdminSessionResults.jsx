import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import NavigationBar from "../components/NavigationBar";
import SessionHeader from "../components/pronosticos/SessionHeader";
import DriverSelect from "../components/pronosticos/DriverSelect"; // Importamos DriverSelect
import { saveSessionResults } from "../api/results";
import { getSessionById } from "../api/sessions";
import { getAllDrivers } from "../api/drivers"; // Importamos getAllDrivers

const AdminSessionResults = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [sessionData, setSessionData] = useState(null);
  const [allDrivers, setAllDrivers] = useState([]); // Estado para los pilotos
  const [loading, setLoading] = useState(false);
  const [loadingDrivers, setLoadingDrivers] = useState(true); // Estado para la carga de pilotos
  const [error, setError] = useState(null);
  const [driversError, setDriversError] = useState(null); // Estado para errores de pilotos

  // Opciones de status
  const statusOptions = ["FINISHED", "DNF", "DNS", "DSQ"];

  // Obtener los detalles de la sesión, los pilotos y configurar los resultados iniciales
  useEffect(() => {
    const fetchSessionDetails = async () => {
      try {
        const data = await getSessionById(sessionId);
        setSessionData({
          countryName: data.country_name,
          flagUrl: `/images/flags/${data.country_name.toLowerCase()}.jpg`,
          sessionName: data.session_name,
          sessionType: data.session_type,
        });
      } catch (err) {
        setError("Error al cargar los detalles de la sesión: " + err.message);
      }
    };

    const fetchDrivers = async () => {
      try {
        setLoadingDrivers(true);
        const response = await getAllDrivers();
        setAllDrivers(response);
      } catch (err) {
        setDriversError(`Error cargando pilotos: ${err.message}`);
      } finally {
        setLoadingDrivers(false);
      }
    };

    // Inicializamos los resultados con 20 posiciones vacías
    const initialResults = Array.from({ length: 20 }, (_, index) => ({
      position: index + 1,
      driverId: null,
      status: "FINISHED",
    }));
    setResults(initialResults);

    fetchSessionDetails();
    fetchDrivers();
  }, [sessionId]);

  // Manejar cambio de piloto
  const handleDriverChange = (position, driverId) => {
    const updatedResults = results.map((result) =>
      result.position === position ? { ...result, driverId: driverId } : result
    );
    setResults(updatedResults);
  };

  // Manejar cambio de status
  const handleStatusChange = (position, status) => {
    const updatedResults = results.map((result) =>
      result.position === position ? { ...result, status } : result
    );
    setResults(updatedResults);
  };

  // Guardar resultados
  const handleSave = async () => {
    const hasEmptyDriver = results.some((result) => !result.driverId);
    if (hasEmptyDriver) {
      setError("Por favor selecciona un piloto para cada posición.");
      return;
    }

    const payload = results.map((result) => ({
      driver_id: result.driverId,
      position: result.status === "FINISHED" ? result.position : null,
      status: result.status,
    }));

    try {
      setLoading(true);
      setError(null);
      await saveSessionResults(sessionId, payload);
      alert("Resultados guardados exitosamente.");
      navigate(`/pronosticos/result/${sessionId}`);
    } catch (err) {
      setError("Error al guardar los resultados: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Manejo de estados de carga y error
  if (loadingDrivers) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-600">Cargando pilotos...</p>
      </div>
    );
  }

  if (driversError) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-red-600">{driversError}</p>
      </div>
    );
  }

  if (error && !sessionData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  // Filtrar pilotos disponibles para cada posición (evitar duplicados)
  const getAvailableDrivers = (currentPosition) => {
    const selectedDriverIds = results
      .filter(
        (result) => result.position !== currentPosition && result.driverId
      )
      .map((result) => result.driverId);
    return allDrivers.filter(
      (driver) => !selectedDriverIds.includes(driver.id)
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <NavigationBar />
      <main className="flex-grow pt-24 px-4 mb-4">
        <div className="mt-12">
          {sessionData ? (
            <SessionHeader
              countryName={sessionData.countryName}
              flagUrl={sessionData.flagUrl}
              sessionName={sessionData.sessionName}
              sessionType={sessionData.sessionType}
              className="mb-4"
            />
          ) : (
            <h2 className="text-2xl font-bold mb-4">
              Cargar Resultados - Sesión {sessionId}
            </h2>
          )}
          {error && <p className="text-red-600 mb-4">{error}</p>}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b text-left">POS</th>
                  <th className="py-2 px-4 border-b text-left">DRIVER</th>
                  <th className="py-2 px-4 border-b text-left">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr key={result.position} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{result.position}</td>
                    <td className="py-2 px-4 border-b">
                      <DriverSelect
                        position={result.position.toString()}
                        value={result.driverId}
                        onChange={(driverId) =>
                          handleDriverChange(result.position, driverId)
                        }
                        drivers={getAvailableDrivers(result.position)}
                      />
                    </td>
                    <td className="py-2 px-4 border-b">
                      <select
                        value={result.status}
                        onChange={(e) =>
                          handleStatusChange(result.position, e.target.value)
                        }
                        className="border border-gray-300 rounded p-1 w-full"
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <button
              onClick={handleSave}
              disabled={loading}
              className={`bg-blue-600 text-white px-4 py-2 rounded ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
              }`}
            >
              {loading ? "Guardando..." : "Guardar Resultados"}
            </button>
          </div>
        </div>
      </main>
      <footer className="bg-gray-200 text-gray-700 text-center py-3 text-sm">
        <p>© 2026 PrediApp</p>
      </footer>
    </div>
  );
};

export default AdminSessionResults;
