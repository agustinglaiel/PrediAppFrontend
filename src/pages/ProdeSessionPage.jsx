// ProdeSessionPage.jsx
import React, { useMemo, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

import Header from "../components/Header";
import NavigationBar from "../components/NavigationBar";
import SessionHeader from "../components/pronosticos/SessionHeader";
import Top3FormHeader from "../components/pronosticos/Top3FormHeader";
import DriverSelect from "../components/pronosticos/DriverSelect";
import SubmitButton from "../components/pronosticos/SubmitButton";
import WarningModal from "../components/pronosticos/WarningModal";

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

  if (loadingDrivers) return <div>Cargando pilotos...</div>;
  if (driversError) return <div>{driversError}</div>;

  const submitLabel = submitting
    ? "Enviando..."
    : existingProde
    ? "Actualizar pronóstico"
    : "Enviar pronóstico";

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <NavigationBar />
      <main className="flex-grow pt-12 pb-24 px-4">
        <SessionHeader
          countryName={sessionDetails.countryName}
          flagUrl={sessionDetails.flagUrl}
          sessionName={sessionDetails.sessionName}
          sessionType={sessionDetails.sessionType}
          className="mt-6"
        />

        {!isRace && (
          <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
            <Top3FormHeader sessionType={sessionDetails.sessionType} />
            <form onSubmit={submit} className="flex flex-col gap-4">
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
    </div>
  );
};

export default ProdeSessionPage;
