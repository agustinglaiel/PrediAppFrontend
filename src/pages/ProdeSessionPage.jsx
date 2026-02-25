// ProdeSessionPage.jsx
import React, { useMemo, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

import Header from "../components/Header";
import NavigationBar from "../components/NavigationBar";
import SessionHeader from "../components/pronosticos/SessionHeader";
import DriverSelect from "../components/pronosticos/DriverSelect";
import SubmitButton from "../components/pronosticos/SubmitButton";
import WarningModal from "../components/pronosticos/WarningModal";
import Top3FormHeader from "../components/pronosticos/Top3FormHeader";

import useSessionProde from "../hooks/useSessionProde";

const isRaceSession = (sessionName, sessionType) => {
  return sessionName === "Race" && sessionType === "Race";
};

const ProdeSessionPage = () => {
  const { session_id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user } = useContext(AuthContext);
  const userId = user?.id;

  const sessionDetails = useMemo(() => {
    if (state) {
      return {
        countryName: state.countryName || "Hungary",
        flagUrl: state.flagUrl || "/images/flags/hungary.jpg",
        sessionType: state.sessionType || "Qualifying",
        sessionName: state.sessionName || "Qualifying",
        dateStart: state.dateStart || "2025-12-02T04:00:00-03:00",
      };
    }
  }, [state]);

  const {
    loadingDrivers,
    driversError,
    formData,
    driversFor,
    handleDriverChange,
    isFormComplete,
    showWarningModal,
    closeWarningModal,
    submit,
    submitting,
    existingProde,
  } = useSessionProde({
    sessionId: session_id,
    userId,
    sessionStartDate: sessionDetails.dateStart,
    onSuccess: () => navigate("/"),
    onError: (err) => {
      console.error("Error submit session prode:", err);
    },
  });

  const isRace = isRaceSession(
    sessionDetails.sessionName,
    sessionDetails.sessionType
  );

  if (loadingDrivers) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <NavigationBar />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-gray-300 border-t-red-500 rounded-full animate-spin" />
            <span className="text-sm text-gray-500">Cargando pilotos...</span>
          </div>
        </main>
      </div>
    );
  }

  if (driversError) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <NavigationBar />
        <main className="flex-grow flex items-center justify-center px-4">
          <div className="text-center p-6 bg-red-50 rounded-xl border border-red-200">
            <p className="text-red-600 font-medium">{driversError}</p>
          </div>
        </main>
      </div>
    );
  }

  const submitLabel = submitting
    ? "Enviando..."
    : existingProde
    ? "Actualizar pronóstico"
    : "Enviar pronóstico";

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <NavigationBar />
      <main className="flex-grow pt-12 pb-28 px-4 max-w-lg mx-auto w-full">
        <SessionHeader
          countryName={sessionDetails.countryName}
          flagUrl={sessionDetails.flagUrl}
          sessionName={sessionDetails.sessionName}
          sessionType={sessionDetails.sessionType}
          className="mt-6"
        />

        {!isRace && (
          <form onSubmit={submit} className="mt-5 space-y-4">
            {/* Instrucciones */}
            <Top3FormHeader sessionType={sessionDetails.sessionType} />

            {/* Selecciones de pilotos */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-1">
              {["P1", "P2", "P3"].map((pos) => (
                <DriverSelect
                  key={pos}
                  position={pos}
                  value={formData[pos]}
                  onChange={(val) => handleDriverChange(pos, val)}
                  disabled={showWarningModal || submitting}
                  drivers={driversFor[pos]}
                />
              ))}
            </div>

            {/* Botón Enviar */}
            <SubmitButton
              isDisabled={!isFormComplete || showWarningModal || submitting}
              label={submitLabel}
            />
          </form>
        )}

        <WarningModal isOpen={showWarningModal} onClose={closeWarningModal} />
      </main>
    </div>
  );
};

export default ProdeSessionPage;
