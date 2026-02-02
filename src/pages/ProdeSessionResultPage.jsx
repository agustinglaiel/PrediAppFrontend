// frontendnuevo/src/pages/ProdeSessionResultPage.jsx
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Header from "../components/Header";
import NavigationBar from "../components/NavigationBar";
import SessionHeader from "../components/pronosticos/SessionHeader";
import MissingProdeSession from "../components/results/MissingProdeSession";

import { AuthContext } from "../contexts/AuthContext";
import useSessionProdeResult from "../hooks/useSessionProdeResult";

const positionLabels = ["P1", "P2", "P3"];

/** Devuelve el apellido (última palabra) de un nombre completo */
const getLastName = (fullName) => {
  if (!fullName || typeof fullName !== "string") return "—";
  const parts = fullName.trim().split(/\s+/);
  return parts.length > 1 ? parts[parts.length - 1] : fullName;
};

const ProdeSessionResultPage = () => {
  const { session_id } = useParams();
  const navigate = useNavigate();
  const { user } = React.useContext(AuthContext);
  const userId = user?.id;

  const {
    loading,
    error,
    sessionInfo,
    prode,
    userDrivers,
    realDriversList,
    missingProde,
  } = useSessionProdeResult({
    sessionId: session_id,
    userId,
    topN: 3,
  });

  // Redirigir si el prode es de carrera (tiene p4/p5)
  useEffect(() => {
    if (prode) {
      if (prode.p4 !== undefined || prode.p5 !== undefined) {
        navigate("/pronosticos");
      }
    }
  }, [prode, navigate]);

  const handleCloseMissingProdeModal = () => {
    navigate("/pronosticos");
  };

  const getColorForPrediction = (predictedId, positionIndex) => {
    if (!realDriversList || realDriversList.length === 0)
      return "bg-red-100 text-red-800";

    const exact = realDriversList[positionIndex]?.driver_id === predictedId;
    if (exact) return "bg-green-100 text-green-800";

    const inTop3 = realDriversList.some((d) => d.driver_id === predictedId);
    if (inTop3) return "bg-yellow-100 text-yellow-800";

    return "bg-red-100 text-red-800";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-500">Cargando resultados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const predictedIds = {
    P1: prode?.p1,
    P2: prode?.p2,
    P3: prode?.p3,
  };
  const predictedNames = {
    P1: userDrivers.p1,
    P2: userDrivers.p2,
    P3: userDrivers.p3,
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <NavigationBar />

      <main className="flex-grow pt-12 pb-24 px-4">
        <SessionHeader
          countryName={sessionInfo?.countryName}
          flagUrl={sessionInfo?.flagUrl}
          sessionName={sessionInfo?.sessionName}
          sessionType={sessionInfo?.sessionType}
          className="mt-4"
        />

        <div className="mt-4 p-2 bg-white rounded-lg shadow-md">
          {prode ? (
            <>
              <h3 className="text-lg font-semibold text-gray-800 mt-2 mb-4 ml-4">
                Tu Pronóstico vs Resultado real
              </h3>
              <div className="flex flex-col gap-2">
                {positionLabels.map((posLabel, idx) => {
                  const predictedId = predictedIds[posLabel];
                  const predictedName = getLastName(
                    predictedNames[posLabel] || "—"
                  );
                  const actualAtPos = realDriversList[idx];
                  const actualName = getLastName(
                    actualAtPos?.full_name || "No disponible"
                  );

                  const colorClasses = getColorForPrediction(
                    predictedId,
                    idx
                  ); // ej: "bg-green-100 text-green-800"

                  return (
                    <div
                      key={posLabel}
                      className={`
                        flex items-center justify-between p-3 rounded-md border
                        ${colorClasses}
                      `}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="w-12 font-bold flex-shrink-0">
                          {posLabel}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <div className="text-sm text-gray-700 truncate">
                            <span className="font-medium">Tu:</span>{" "}
                            {predictedName}
                          </div>
                          <div className="text-sm text-gray-600 truncate">
                            <span className="font-medium">Real:</span>{" "}
                            {actualName}
                          </div>
                        </div>
                      </div>
                      <div className="w-36 flex-shrink-0 text-right">
                        {colorClasses.includes("green") && (
                          <div className="text-sm font-semibold text-green-800">
                            Acierto
                          </div>
                        )}
                        {colorClasses.includes("yellow") && (
                          <div className="text-sm font-semibold text-yellow-800">
                            Top3
                          </div>
                        )}
                        {colorClasses.includes("red") && (
                          <div className="text-sm font-semibold text-red-800">
                            Fallaste
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {prode?.score != null && (
                <div className="mt-4 text-center">
                  <p className="text-lg font-semibold text-gray-800">
                    Puntaje obtenido: {prode.score} puntos
                  </p>
                </div>
              )}
            </>
          ) : (
            !missingProde && (
              <p className="text-center text-gray-600">
                No hay pronóstico disponible para esta sesión.
              </p>
            )
          )}
        </div>
      </main>

      <MissingProdeSession
        isOpen={missingProde}
        onClose={handleCloseMissingProdeModal}
      />
    </div>
  );
};

export default ProdeSessionResultPage;
