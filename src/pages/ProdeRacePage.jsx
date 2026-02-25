// ProdeRacePage.jsx
import React, { useContext, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import Header from "../components/Header";
import NavigationBar from "../components/NavigationBar";
import SessionHeader from "../components/pronosticos/SessionHeader";
import DriverSelect from "../components/pronosticos/DriverSelect";
import YesNoButton from "../components/pronosticos/YesNoButton";
import SubmitButton from "../components/pronosticos/SubmitButton";
import WarningModal from "../components/pronosticos/WarningModal";
import Top5FormHeader from "../components/pronosticos/Top5FormHeader";
import useRaceProde from "../hooks/useRaceProde";

const isRaceSession = (sessionName, sessionType) => {
  return sessionName === "Race" && sessionType === "Race";
};

const ProdeRacePage = () => {
  const { session_id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const userId = user?.id;

  const sessionDetails = useMemo(() => {
    if (state) {
      return {
        countryName: state.countryName,
        flagUrl: state.flagUrl,
        sessionType: state.sessionType,
        sessionName: state.sessionName,
        dateStart: state.dateStart,
      };
    } else {
      return {
        countryName: "Hungary",
        flagUrl: "/images/flags/hungary.jpg",
        sessionType: "Race",
        sessionName: "Race",
        dateStart: "2025-12-02T04:00:00-03:00",
      };
    }
  }, [state]);

  const {
    loadingDrivers,
    driversError,
    formData,
    driversFor,
    handleDriverChange,
    handleToggle,
    handleDnfChange,
    isFormComplete,
    showWarningModal,
    closeWarningModal,
    submit,
    submitting,
    existingProde,
  } = useRaceProde({
    sessionId: session_id,
    userId,
    sessionStartDate: sessionDetails.dateStart,
    onSuccess: () => navigate("/"),
    onError: (err) => {
      console.error("Submit failed:", err);
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

        {isRace && (
          <form onSubmit={submit} className="mt-5 space-y-4">
            {/* Instrucciones */}
            <Top5FormHeader sessionType={sessionDetails.sessionType} />

            {/* Selecciones de pilotos */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-1">
              {["P1", "P2", "P3", "P4", "P5"].map((pos) => (
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

            {/* Safety Car & DNF */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Extras
              </h4>

              <div className="flex justify-around mb-4">
                <YesNoButton
                  label="Virtual Safety Car"
                  value={formData.vsc}
                  onChange={(newVal) => handleToggle("vsc", newVal)}
                  disabled={showWarningModal || submitting}
                />
                <YesNoButton
                  label="Safety Car"
                  value={formData.sf}
                  onChange={(newVal) => handleToggle("sf", newVal)}
                  disabled={showWarningModal || submitting}
                />
              </div>

              <div className="flex flex-col items-center">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  DNF (No terminan)
                </label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  className="w-20 h-10 border border-gray-200 rounded-lg text-center text-base font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                  value={formData.dnf === 0 ? "" : formData.dnf}
                  placeholder="0"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "") {
                      handleDnfChange(0);
                    } else {
                      const numValue = parseInt(value, 10);
                      if (
                        !isNaN(numValue) &&
                        numValue >= 0 &&
                        numValue <= 20
                      ) {
                        handleDnfChange(numValue);
                      }
                    }
                  }}
                  disabled={showWarningModal || submitting}
                />
              </div>
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

export default ProdeRacePage;
