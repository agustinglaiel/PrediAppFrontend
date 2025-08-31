// frontendnuevo/src/pages/ProdeRaceResultPage.jsx
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Header from "../components/Header";
import NavigationBar from "../components/NavigationBar";
import SessionHeader from "../components/pronosticos/SessionHeader";
import MissingProdeSession from "../components/results/MissingProdeSession";

import { AuthContext } from "../contexts/AuthContext";
import useRaceProdeResult from "../hooks/useRaceProdeResult";

const positionLabels = ["P1", "P2", "P3", "P4", "P5"];

/** Extrae apellido (última palabra) */
const getLastName = (fullName) => {
  if (!fullName || typeof fullName !== "string") return "—";
  const parts = fullName.trim().split(/\s+/);
  return parts.length > 1 ? parts[parts.length - 1] : fullName;
};

const ProdeRaceResultPage = () => {
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
    realRaceExtras,
    missingProde,
  } = useRaceProdeResult({
    sessionId: session_id,
    userId,
    topN: 5,
  });

  // Redirigir si no es carrera
  useEffect(() => {
    if (sessionInfo && sessionInfo.sessionType !== "Race") {
      navigate("/pronosticos");
    }
  }, [sessionInfo, navigate]);

  const handleCloseMissingProdeModal = () => {
    navigate("/pronosticos");
  };

  // Coloreado para posiciones (P1..P5)
  const getColorForPrediction = (positionIndex) => {
    if (!realDriversList || realDriversList.length === 0 || !prode)
      return "bg-red-100 text-red-800";

    const predictedId = prode[`p${positionIndex + 1}`];
    const exact = realDriversList[positionIndex]?.driver_id === predictedId;
    if (exact) return "bg-green-100 text-green-800";

    const inTop = realDriversList.some((d) => d.driver_id === predictedId);
    if (inTop) return "bg-yellow-100 text-yellow-800";

    return "bg-red-100 text-red-800";
  };

  // Coloreado para extras; si falta dato en alguno (pred/real) => gris
  const getColorForExtra = (predictedValue, realValue) => {
    const noData =
      realValue === null ||
      realValue === undefined ||
      predictedValue === null ||
      predictedValue === undefined;

    if (noData) return "bg-gray-100 text-gray-800";

    const same =
      typeof predictedValue === "boolean"
        ? predictedValue === realValue
        : Number(predictedValue) === Number(realValue);

    return same ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
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

  const predictedNames = {
    P1: getLastName(userDrivers.p1),
    P2: getLastName(userDrivers.p2),
    P3: getLastName(userDrivers.p3),
    P4: getLastName(userDrivers.p4),
    P5: getLastName(userDrivers.p5),
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <NavigationBar />

      <main className="flex-grow pt-12 px-4 pb-8">
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
                  const predictedName = predictedNames[posLabel] || "—";
                  const actualName = realDriversList[idx]?.full_name
                    ? getLastName(realDriversList[idx].full_name)
                    : "No disponible";
                  const colorClasses = getColorForPrediction(idx);

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
                            Top5
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

              {/* Extras: VSC / SC / DNF */}
              <div className="mt-6">
                <h4 className="text-md font-semibold mb-2 ml-4">Otros</h4>
                <div className="flex gap-4 ml-4">
                  {/* VSC */}
                  <div
                    className={`
                      flex flex-col justify-between p-3 rounded-md font-semibold
                      ${getColorForExtra(prode?.vsc, realRaceExtras.vsc)}
                      w-48 h-20
                    `}
                  >
                    <div className="text-base">VSC</div>
                    <div className="text-xs mt-1">
                      <div>
                        <span className="font-medium">Tu:</span>{" "}
                        {prode?.vsc ? "Sí" : "No"}
                      </div>
                      <div>
                        <span className="font-medium">Real:</span>{" "}
                        {realRaceExtras.vsc === true
                          ? "Sí"
                          : realRaceExtras.vsc === false
                          ? "No"
                          : "—"}
                      </div>
                    </div>
                  </div>

                  {/* SC */}
                  <div
                    className={`
                      flex flex-col justify-between p-3 rounded-md font-semibold
                      ${getColorForExtra(prode?.sc, realRaceExtras.sc)}
                      w-48 h-20
                    `}
                  >
                    <div className="text-base">SC</div>
                    <div className="text-xs mt-1">
                      <div>
                        <span className="font-medium">Tu:</span>{" "}
                        {prode?.sc ? "Sí" : "No"}
                      </div>
                      <div>
                        <span className="font-medium">Real:</span>{" "}
                        {realRaceExtras.sc === true
                          ? "Sí"
                          : realRaceExtras.sc === false
                          ? "No"
                          : "—"}
                      </div>
                    </div>
                  </div>

                  {/* DNF */}
                  <div
                    className={`
                      flex flex-col justify-between p-3 rounded-md font-semibold
                      ${getColorForExtra(prode?.dnf, realRaceExtras.dnf)}
                      w-48 h-20
                    `}
                  >
                    <div className="text-base">DNF</div>
                    <div className="text-xs mt-1">
                      <div>
                        <span className="font-medium">Tu:</span>{" "}
                        {prode?.dnf ?? "—"}
                      </div>
                      <div>
                        <span className="font-medium">Real:</span>{" "}
                        {realRaceExtras.dnf ?? "—"}
                      </div>
                    </div>
                  </div>
                </div>
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
                No hay pronóstico disponible para esta carrera.
              </p>
            )
          )}
        </div>
      </main>

      <MissingProdeSession
        isOpen={missingProde}
        onClose={handleCloseMissingProdeModal}
      />

      <footer className="bg-gray-200 text-gray-700 text-center py-3 text-sm">
        <p>© 2025 PrediApp</p>
      </footer>
    </div>
  );
};

export default ProdeRaceResultPage;
