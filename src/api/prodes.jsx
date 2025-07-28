import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080/api";

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
      sc: !!prodeData.sc,
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

// Actualizar un prode de carrera
// export const updateProdeCarrera = async (id, prodeData) => {
//   try {
//     const response = await axios.put(
//       `${API_URL}/prode-carrera/${id}`,
//       prodeData
//     );
//     return response.data;
//   } catch (error) {
//     throw new Error(
//       error.response.data.message || "Error updating race prediction."
//     );
//   }
// };

// // Actualizar un prode de sesión
// export const updateProdeSession = async (id, prodeData) => {
//   try {
//     const response = await axios.put(
//       `${API_URL}/prode-session/${id}`,
//       prodeData
//     );
//     return response.data;
//   } catch (error) {
//     throw new Error(
//       error.response.data.message || "Error updating session prediction."
//     );
//   }
// };

// Eliminar un prode por ID
// export const deleteProdeByID = async (id, userId) => {
//   try {
//     await axios.delete(`${API_URL}/prode/${id}`, {
//       params: { userID: userId },
//     });
//   } catch (error) {
//     throw new Error(
//       error.response?.data?.message || "Error deleting prediction."
//     );
//   }
// };

// Obtener un prode de carrera por user_id y session_id
// export const getRaceProdeByUserAndSession = async (userId, sessionId) => {
//   try {
//     const { data } = await axios.get(
//       `${API_URL}/prodes/carrera/user/${userId}/session/${sessionId}`,
//       { validateStatus: (status) => status === 200 }
//     );

//     // Si viene vacío o todos los campos null/"", devolvemos null
//     if (
// !data ||
//       (typeof data === "object" &&
//         Object.values(data).every((v) => v === null || v === ""))
//     ) {
//       return null;
//     }
//     return data;
//   } catch (error) {
//     // Silenciar 404/400
//     if (error.response && [400, 404].includes(error.response.status)) {
//       return null;
//     }
//     console.error(
//       `Unexpected error fetching race prode for user ${userId}, session ${sessionId}:`,
//       error
//     );
//     throw new Error(error.message || "Error fetching race prediction.");
//   }
// };

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

// Actualizar puntajes de pronósticos de carrera
export const updateRaceProdeScores = async (sessionId) => {
  try {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      throw new Error("Authentication token not found. Please log in.");
    }

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
    return response.data;
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
    if (!token) {
      throw new Error("Authentication token not found. Please log in.");
    }

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
    return response.data;
  } catch (error) {
    console.error("Error updating session prode scores:", error);
    const errorMsg =
      error.response?.data?.message || "Error updating session prode scores.";
    throw new Error(errorMsg);
  }
};
