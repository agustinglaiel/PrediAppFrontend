import React, { useEffect, useMemo, useState } from "react";
import { getDriversClassification, getTeamsClassification } from "../../api/results";
import { getAllDrivers } from "../../api/drivers";
import ClassificationTabs from "./ClassificationTabs";
import DriversClassificationTable from "./DriversClassificationTable";
import TeamsClassificationTable from "./TeamsClassificationTable";
import ClassificationEmptyState from "./ClassificationEmptyState";

const normalizeClassification = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }
  if (payload?.classification && Array.isArray(payload.classification)) {
    return payload.classification;
  }
  return [];
};

const ClassificationBoard = () => {
  const [activeTab, setActiveTab] = useState("drivers");
  const [driversData, setDriversData] = useState([]);
  const [teamsData, setTeamsData] = useState([]);
  const [driversDirectory, setDriversDirectory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchClassifications = async () => {
      try {
        setLoading(true);
        setError(null);

        const [driversResult, teamsResult, directoryResult] =
          await Promise.allSettled([
            getDriversClassification(currentYear),
            getTeamsClassification(currentYear),
            getAllDrivers(),
          ]);

        if (driversResult.status === "rejected") {
          throw driversResult.reason;
        }

        if (teamsResult.status === "rejected") {
          throw teamsResult.reason;
        }

        setDriversData(normalizeClassification(driversResult.value));
        setTeamsData(normalizeClassification(teamsResult.value));

        if (directoryResult.status === "fulfilled") {
          setDriversDirectory(Array.isArray(directoryResult.value) ? directoryResult.value : []);
        } else {
          setDriversDirectory([]);
          console.warn("No se pudo cargar el directorio de pilotos:", directoryResult.reason);
        }
      } catch (err) {
        console.error("Error fetching classifications:", err);
        setError(err.message || "Error al cargar la clasificación.");
      } finally {
        setLoading(false);
      }
    };

    fetchClassifications();
  }, [currentYear]);

  const driversById = useMemo(() => {
    return new Map(
      driversDirectory.map((driver) => [driver.id ?? driver.driver_id, driver])
    );
  }, [driversDirectory]);

  const renderDriversContent = () => {
    if (!driversData.length) {
      return (
        <ClassificationEmptyState
          year={currentYear}
          title="Sin datos de clasificación"
          description="Aún no hay resultados disponibles para la clasificación de pilotos de esta temporada"
        />
      );
    }

    return (
      <DriversClassificationTable
        drivers={driversData}
        driversById={driversById}
      />
    );
  };

  const renderTeamsContent = () => {
    if (!teamsData.length) {
      return (
        <ClassificationEmptyState
          year={currentYear}
          title="Sin datos de clasificación"
          description="Aún no hay resultados disponibles para la clasificación de constructores de esta temporada"
        />
      );
    }

    return <TeamsClassificationTable teams={teamsData} />;
  };

  return (
    <>
      <ClassificationTabs activeTab={activeTab} onChange={setActiveTab} />

      <div className="px-4 max-w-4xl mx-auto">
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <p className="text-gray-600">Cargando clasificación...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-sm border border-red-100 p-8 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        ) : activeTab === "drivers" ? (
          renderDriversContent()
        ) : (
          renderTeamsContent()
        )}
      </div>
    </>
  );
};

export default ClassificationBoard;
