import axios from "axios";
import { getUserFromToken, getUserScoreByUserId, getUserById } from "../api/users";
import { setStoredScore } from "../utils/scoreStorage";

// axios.defaults.baseURL = "http://localhost:8080/api";
axios.defaults.baseURL = "/api";

// Crear un prode de carrera
export const createProdeCarrera = async (userId, prodeData) => {
  try {
    if (!userId) throw new Error("User ID is required");

    const payload = {
      user_id: userId,
      session_id: +prodeData.session_id, // convierto a número
      p1: +prodeData.p1,
      p2: +prodeData.p2,
      p3: +prodeData.p3,
      p4: +prodeData.p4,
      p5: +prodeData.p5,
      vsc: !!prodeData.vsc,
      sf: !!prodeData.sf,
      dnf: +prodeData.dnf,
    };

    const { data } = await axios.post(`/prodes/carrera`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return data;
  } catch (error) {
    console.error("Error creating/updating race prediction:", error);
    throw new Error(
      error.response?.data?.message || "Error creating race prediction."
    );
  }
};

// Crear un prode de sesión
export const createProdeSession = async (userId, prodeData) => {
  try {
    if (!userId) throw new Error("User ID is required");

    const payload = {
      user_id: userId,
      session_id: +prodeData.session_id,
      p1: +prodeData.p1,
      p2: +prodeData.p2,
      p3: +prodeData.p3,
    };

    const { data } = await axios.post(`/prodes/session`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return data;
  } catch (error) {
    console.error("Error creating/updating session prediction:", error);
    throw new Error(
      error.response?.data?.message || "Error creating session prediction."
    );
  }
};

// Obtener un prode de carrera por ID
export const getProdeCarreraByID = async (id) => {
  try {
    const response = await axios.get(`/prode-carrera/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response.data.message || "Error fetching race prediction."
    );
  }
};

// Obtener un prode de sesión por ID
export const getProdeSessionByID = async (id) => {
  try {
    const response = await axios.get(`/prode-session/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response.data.message || "Error fetching session prediction."
    );
  }
};


// Obtener un prode de sesión por user_id y session_id
export const getProdeByUserAndSession = async (userId, sessionId) => {
  try {
    const { data } = await axios.get(
      `/prodes/user/${userId}/session/${sessionId}`,
      { validateStatus: (status) => status === 200 }
    );

    if (!Array.isArray(data) || data.length === 0) {
      return null;
    }
    return data[0];
  } catch (error) {
    console.error(
      `Unexpected error fetching prode for user ${userId}, session ${sessionId}:`,
      error
    );
    throw new Error(error.message || "Error fetching prode prediction.");
  }
};

// #################################

// Helper: refresca el score real y lo guarda en localStorage
async function refreshAndPersistScore() {
  const me = getUserFromToken?.();
  if (!me?.id) return; 
  try {
    const { status, data } = await getUserScoreByUserId(me.id);
    if (status === 200 && data) {
      const score = typeof data.total_score === "number" ? data.total_score : (typeof data.score === "number" ? data.score : null);
      if (score !== null) {
        setStoredScore(score, data.season_year);
        return;
      }
    }
  } catch {
  }

  try {
    const fresh = await getUserById(me.id);
    if (typeof fresh?.score === "number") {
      setStoredScore(fresh.score);
    }
  } catch {
  }
}

// Actualizar puntajes de pronósticos de carrera
export const updateRaceProdeScores = async (sessionId) => {
  try {
    const token = localStorage.getItem("jwtToken");
    if (!token) throw new Error("Authentication token not found. Please log in.");

    const response = await axios.post(
      `/prodes/carrera/${sessionId}/score`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Tras el OK, refrescar y persistir el nuevo score
    await refreshAndPersistScore();

    return response.data; // { message: "Scores updated successfully" }
  } catch (error) {
    console.error("Error updating race prode scores:", error);
    const errorMsg =
      error.response?.data?.message || "Error updating race prode scores.";
    throw new Error(errorMsg);
  }
};

// Actualizar puntajes de pronósticos de sesión
export const updateSessionProdeScores = async (sessionId) => {
  try {
    const token = localStorage.getItem("jwtToken");
    if (!token) throw new Error("Authentication token not found. Please log in.");

    const response = await axios.post(
      `/prodes/session/${sessionId}/score`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Tras el OK, refrescar y persistir el nuevo score
    await refreshAndPersistScore();

    return response.data; // { message: "Scores updated successfully" }
  } catch (error) {
    console.error("Error updating session prode scores:", error);
    const errorMsg =
      error.response?.data?.message || "Error updating session prode scores.";
    throw new Error(errorMsg);
  }
};