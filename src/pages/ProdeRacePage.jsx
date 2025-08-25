// ProdeRacePage.jsx
import React, { useContext, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import Header from "../components/Header";
import NavigationBar from "../components/NavigationBar";
import SessionHeader from "../components/pronosticos/SessionHeader";
import Top5FormHeader from "../components/pronosticos/Top5FormHeader";
import DriverSelect from "../components/pronosticos/DriverSelect";
import YesNoButton from "../components/pronosticos/YesNoButton";
import SubmitButton from "../components/pronosticos/SubmitButton";
import WarningModal from "../components/pronosticos/WarningModal";
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
    return <div>Cargando pilotos...</div>;
  }

  if (driversError) {
    return <div>{driversError}</div>;
  }

  const submitLabel = submitting
    ? "Enviando..."
    : existingProde
    ? "Actualizar pronóstico"
    : "Enviar pronóstico";

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <NavigationBar />
      <main className="flex-grow pt-12 px-4 pb-8">
        <SessionHeader
          countryName={sessionDetails.countryName}
          flagUrl={sessionDetails.flagUrl}
          sessionName={sessionDetails.sessionName}
          sessionType={sessionDetails.sessionType}
          className="mt-6"
        />
        {isRace && (
          <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
            <Top5FormHeader sessionType={sessionDetails.sessionType} />
            <form onSubmit={submit} className="flex flex-col gap-4 mt-4">
              <DriverSelect
                position="P1"
                value={formData.P1}
                onChange={(val) => handleDriverChange("P1", val)}
                disabled={showWarningModal || submitting}
                drivers={driversFor.P1}
              />
              <DriverSelect
                position="P2"
                value={formData.P2}
                onChange={(val) => handleDriverChange("P2", val)}
                disabled={showWarningModal || submitting}
                drivers={driversFor.P2}
              />
              <DriverSelect
                position="P3"
                value={formData.P3}
                onChange={(val) => handleDriverChange("P3", val)}
                disabled={showWarningModal || submitting}
                drivers={driversFor.P3}
              />
              <DriverSelect
                position="P4"
                value={formData.P4}
                onChange={(val) => handleDriverChange("P4", val)}
                disabled={showWarningModal || submitting}
                drivers={driversFor.P4}
              />
              <DriverSelect
                position="P5"
                value={formData.P5}
                onChange={(val) => handleDriverChange("P5", val)}
                disabled={showWarningModal || submitting}
                drivers={driversFor.P5}
              />

              <div className="flex flex-row gap-8 justify-center mb-4">
                <YesNoButton
                  label="Virtual Safety Car"
                  value={formData.vsc}
                  onChange={(newVal) => handleToggle("vsc", newVal)}
                  disabled={showWarningModal || submitting}
                />
                <YesNoButton
                  label="Safety Car"
                  value={formData.sc}
                  onChange={(newVal) => handleToggle("sc", newVal)}
                  disabled={showWarningModal || submitting}
                />
              </div>

              {/* Campo DNF centrado */}
              <div className="flex flex-col items-center mb-2">
                <label className="block text-xs font-medium text-black mb-1">
                  DNF (No terminan)
                </label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  className="border-2 border-gray-300 p-2 rounded-lg w-24 text-center text-base font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={formData.dnf === 0 ? "" : formData.dnf}
                  placeholder="0"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "") {
                      handleDnfChange(0);
                    } else {
                      const numValue = parseInt(value, 10);
                      if (!isNaN(numValue) && numValue >= 0 && numValue <= 20) {
                        handleDnfChange(numValue);
                      }
                    }
                  }}
                  disabled={showWarningModal || submitting}
                />
              </div>

              <SubmitButton
                isDisabled={!isFormComplete || showWarningModal || submitting}
                onClick={submit}
                label={submitLabel}
                className="mt-4"
              />
            </form>
          </div>
        )}
        <WarningModal isOpen={showWarningModal} onClose={closeWarningModal} />
      </main>
      <footer className="bg-gray-200 text-gray-700 text-center py-3 text-sm">
        <p>© 2025 PrediApp</p>
      </footer>
    </div>
  );
};

export default ProdeRacePage;
