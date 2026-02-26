import axios from "axios";

// axios.defaults.baseURL = "http://localhost:8080/api";
axios.defaults.baseURL = "/api";

// Obtener resultados de una sesión ordenados por posición
// Returns { session: {...}, results: [...] }
export const getResultsOrderedByPosition = async (sessionID) => {
  try {
    const response = await axios.get(`/results/session/${sessionID}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ordered results for session ${sessionID}:`, {
      message: error.message,
      response: error.response?.data,
    });
    throw new Error(
      error.response?.data?.message ||
        "Error fetching ordered results for the session."
    );
  }
};

// Obtener los mejores N pilotos de una sesión
// Returns TopDriverDTO[] -> { position, driver_id }
export const getTopNDriversInSession = async (sessionID, n) => {
  try {
    if (!sessionID || !n) {
      throw new Error("Session ID and number of drivers are required");
    }
    if (n <= 0) {
      throw new Error("Number of drivers must be greater than 0");
    }

    const response = await axios.get(
      `/results/session/${sessionID}/top/${n}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return [];
    }
    console.error(`Error fetching top ${n} drivers for session ${sessionID}:`, {
      message: error.message,
      response: error.response?.data,
    });
    throw new Error(
      error.response?.data?.message ||
        `Error fetching top ${n} drivers for the session.`
    );
  }
};

// Guardar resultados masivamente (POST /results/admin)
// Statuses válidos: FINISHED, DNF, DNS, DSQ
// Posiciones válidas: 1–22, sin duplicados; driver_id sin duplicados
export const saveSessionResultsAdmin = async (sessionId, results) => {
  try {
    const payload = {
      session_id: parseInt(sessionId),
      results: results.map((result) => ({
        driver_id: result.driver_id,
        position: result.position,
        status: result.status || "DNF",
      })),
    };

    console.log("Saving results payload:", JSON.stringify(payload, null, 2));

    const response = await axios.post(`/results/admin`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error saving results for session ${sessionId}:`, {
      message: error.message,
      response: error.response?.data,
    });
    throw new Error(
      error.response?.data?.message || "Error saving results for the session."
    );
  }
};

// Listar todos los resultados existentes
export const getAllResults = async () => {
  try {
    const response = await axios.get(`/results`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return [];
    }
    console.error("Error fetching all results:", {
      message: error.message,
      response: error.response?.data,
    });
    throw new Error(
      error.response?.data?.message || "Error fetching all results."
    );
  }
};

// Eliminar todos los resultados de una sesión (DELETE /results/session/:sessionID)
export const deleteSessionResults = async (sessionID) => {
  try {
    await axios.delete(`/results/session/${sessionID}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
    });
  } catch (error) {
    if (error.response?.status === 404) {
      console.warn(`No results found to delete for session ${sessionID}`);
      return;
    }
    console.error(`Error deleting results for session ${sessionID}:`, {
      message: error.message,
      response: error.response?.data,
    });
    throw new Error(
      error.response?.data?.message ||
        `Error deleting results for session ${sessionID}.`
    );
  }
};

// Obtener clasificación de pilotos por año
export const getDriversClassification = async (year) => {
  try {
    const response = await axios.get(
      `/results/drivers/classification/season/${year}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      console.warn(
        `No hay resultados de clasificación de pilotos para el año ${year}`
      );
      return { year, classification: [], total_drivers: 0 };
    }
    console.error(`Error fetching drivers classification for year ${year}:`, {
      message: error.message,
      response: error.response?.data,
    });
    throw new Error(
      error.response?.data?.message ||
        `Error fetching drivers classification for year ${year}.`
    );
  }
};

// Obtener clasificación de equipos/constructores por año
export const getTeamsClassification = async (year) => {
  try {
    const response = await axios.get(
      `/results/teams/classification/season/${year}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      console.warn(
        `No hay resultados de clasificación de equipos para el año ${year}`
      );
      return { year, classification: [], total_teams: 0 };
    }
    console.error(`Error fetching teams classification for year ${year}:`, {
      message: error.message,
      response: error.response?.data,
    });
    throw new Error(
      error.response?.data?.message ||
        `Error fetching teams classification for year ${year}.`
    );
  }
};
