import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080/api";
// axios.defaults.baseURL = "/api";

// Función para obtener las próximas sesiones (ahora pública, sin token)
export const getUpcomingSessions = async () => {
  try {
    const response = await axios.get(`/sessions/upcoming`);
    return response.data;
  } catch (error) {
    console.error("Error fetching upcoming sessions:", error);
    if (error.response) {
      throw new Error(
        `Error en la API: ${error.response.data.message || error.message}`
      );
    }
    throw error;
  }
};

export const getPastSessions = async () => {
  try {
    const response = await axios.get(`/sessions/lasts`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching past sessions: " + error.message);
  }
};

// Función para obtener la sesión por ID (puedes mantenerla como privada si es necesario, pero la haremos pública también por simplicidad)
export const getSessionById = async (sessionId) => {
  try {
    const response = await axios.get(`/sessions/${sessionId}`);
    return response.data; // Retornamos los datos de la sesión
  } catch (error) {
    throw new Error("Error fetching session by ID: " + error.message);
  }
};

export const createSession = async (sessionData) => {
  try {
    const response = await axios.post(`/sessions`, sessionData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
    });
    return { data: response.data, status: response.status };
  } catch (error) {
    console.error("Error creating session:", error);
    const causes = error.response?.data?.cause;
    const message =
      causes && Array.isArray(causes) && causes.length > 0
        ? causes.join(". ")
        : error.response?.data?.message ||
          "Error al crear la sesión. Contacta al soporte.";
    throw new Error(message);
  }
};

export const updateSession = async (sessionId, sessionData) => {
  try {
    const response = await axios.put(
      `/sessions/${sessionId}`,
      sessionData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      }
    );
    return { data: response.data, status: response.status };
  } catch (error) {
    console.error("Error updating session:", error);
    const causes = error.response?.data?.cause;
    const message =
      causes && Array.isArray(causes) && causes.length > 0
        ? causes.join(". ")
        : error.response?.data?.message ||
          "Error al actualizar la sesión. Contacta al soporte.";
    throw new Error(message);
  }
};
