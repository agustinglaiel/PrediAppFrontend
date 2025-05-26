import axios from "axios";

const API_URL = "http://localhost:8080";

// New function to get results ordered by position for a session
export const getResultsOrderedByPosition = async (sessionID) => {
  try {
    const response = await axios.get(
      `${API_URL}/results/session/${sessionID}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(`Results for session ${sessionID}:`, response.data);
    return response.data; // Returns array of ResponseResultDTO
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

// New function to get top N drivers in a session
// frontendnuevo/src/api/results.jsx
export const getTopNDriversInSession = async (sessionID, n) => {
  try {
    // Validate inputs
    if (!sessionID || !n) {
      throw new Error("Session ID and number of drivers are required");
    }
    if (n <= 0) {
      throw new Error("Number of drivers must be greater than 0");
    }

    const response = await axios.get(
      `${API_URL}/results/session/${sessionID}/top/${n}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(`Top ${n} drivers for session ${sessionID}:`, response.data);
    return response.data; // Returns array of TopDriverDTO
  } catch (error) {
    if (error.response?.status === 404) {
      console.log(
        `No results found for session ${sessionID}, returning empty array`
      );
      return []; // Devolver array vacío en lugar de lanzar error
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

// Guardar resultados masivamente (usando el endpoint /results/admin)
export const saveSessionResultsAdmin = async (sessionId, results) => {
  try {
    const payload = {
      session_id: parseInt(sessionId), // Aseguramos que sea un entero
      results: results.map((result) => ({
        driver_id: result.driver_id,
        position: result.status === "FINISHED" ? result.position : null, // null si no es "FINISHED"
        status: result.status || "DNF", // Por defecto "DNF" si no se proporciona
        fastest_lap_time: result.fastest_lap_time || 0, // Por defecto 0 si no se proporciona
      })),
    };

    const response = await axios.post(`${API_URL}/results/admin`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`, // Añadimos token si es necesario
      },
    });
    console.log(`Results saved for session ${sessionId}:`, response.data);
    return response.data; // Devuelve array de ResponseResultDTO
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

export const FetchNonRaceResultsExternalAPI = async (sessionID) => {
  try {
    const response = await axios.get(
      `${API_URL}/results/session/api/${sessionID}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error(
      `Error fetching non race results from external API for session ${sessionID}:`,
      {
        message: error.message,
        response: error.response?.data,
      }
    );
    throw new Error(
      error.response?.data?.message ||
        "Error fetching non race results from external API for the session."
    );
  }
};

export const fetchResultsFromExternalAPI = async (sessionID) => {
  try {
    const response = await axios.get(`${API_URL}/results/api/${sessionID}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(
      `Fetched results from external API for session ${sessionID}:`,
      response.data
    );
    return response.data; // Devuelve array de ResponseResultDTO
  } catch (error) {
    console.error(
      `Error fetching results from external API for session ${sessionID}:`,
      {
        message: error.message,
        response: error.response?.data,
      }
    );
    throw new Error(
      error.response?.data?.message ||
        "Error fetching results from external API for the session."
    );
  }
};
