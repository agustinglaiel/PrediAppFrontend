import React, { useState, useEffect } from "react";
import { getResultsOrderedByPosition } from "../../api/results";

const UpdateResults = ({ session, drivers, onSave, onCancel }) => {
  const [results, setResults] = useState(
    Array.from({ length: 20 }, (_, index) => ({
      position: index + 1,
      driver_id: null,
      status: "FINISHED",
    }))
  );

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await getResultsOrderedByPosition(session.id);
        const existingResults = data.results || [];
        if (existingResults.length > 0) {
          // Mapear los resultados existentes al formato del estado
          const formattedResults = Array.from({ length: 20 }, (_, index) => {
            const result = existingResults.find(
              (r) => r.position === index + 1
            );
            return {
              position: index + 1,
              driver_id: result ? result.driver.id : null,
              status: result ? result.status : "FINISHED",
            };
          });
          setResults(formattedResults);
        }
      } catch (error) {
        console.error("Error fetching results for session:", error);
        // Mantener el estado inicial si hay un error
      }
    };

    fetchResults();
  }, [session.id]);

  const handleDriverChange = (position, driverId) => {
    const updatedResults = [...results];
    updatedResults[position - 1].driver_id = driverId;
    setResults(updatedResults);
  };

  const handleStatusChange = (position, status) => {
    const updatedResults = [...results];
    updatedResults[position - 1].status = status;
    setResults(updatedResults);
  };

  const handleSave = () => {
    const validResults = results.filter((result) => result.driver_id !== null);
    onSave(validResults);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-3xl max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
          Actualizar Resultados - {session.sessionName}
        </h2>

        <div className="mb-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-2 px-3 text-center text-sm font-medium text-gray-700">
                  Pos
                </th>
                <th className="py-2 px-3 text-center text-sm font-medium text-gray-700">
                  Piloto
                </th>
                <th className="py-2 px-3 text-center text-sm font-medium text-gray-700">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr
                  key={result.position}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-1 px-3 text-sm text-gray-700 text-center">
                    {result.position}
                  </td>
                  <td className="py-1 px-3 text-center">
                    <div className="relative">
                      <select
                        value={result.driver_id || ""}
                        onChange={(e) =>
                          handleDriverChange(
                            result.position,
                            parseInt(e.target.value) || null
                          )
                        }
                        className="w-full text-sm py-1 text-gray-700 border-0 focus:ring-0 appearance-none bg-transparent text-center"
                      >
                        <option value="">Seleccionar piloto</option>
                        {drivers.map((driver) => (
                          <option key={driver.id} value={driver.id}>
                            {driver.full_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="py-1 px-3 text-center">
                    <div className="relative">
                      <select
                        value={result.status}
                        onChange={(e) =>
                          handleStatusChange(result.position, e.target.value)
                        }
                        className="w-full text-sm py-1 text-gray-700 border-0 focus:ring-0 appearance-none bg-transparent text-center"
                      >
                        <option value="FINISHED">FINISHED</option>
                        <option value="DNF">DNF</option>
                        <option value="DNS">DNS</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 bg-blue-500 text-white hover:bg-blue-600"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateResults;
