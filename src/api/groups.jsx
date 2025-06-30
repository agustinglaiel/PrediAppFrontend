import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

export const getGroupByUserId = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/groups/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
    });
    return response.data; // GroupResponseDTO
  } catch (error) {
    // 404 → usuario aún no pertenece a ningún grupo
    if (error.response?.status === 404) return null;
    console.error("Error fetching group by user ID:", error);
    throw new Error(
      error.response?.data?.message ||
        "Error al obtener el grupo. Intenta nuevamente."
    );
  }
};

export const joinGroup = async (groupCode, userId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/groups/join`,
      {
        group_code: groupCode,
        user_id: userId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error joining group:", error);
    throw new Error(
      error.response?.data?.message ||
        "No se pudo enviar la solicitud para unirse al grupo."
    );
  }
};

export const createGroup = async ({ groupName, userId, description = "" }) => {
  try {
    const payload = {
      group_name: groupName,
      user_id: userId,
      ...(description && { description }),
    };

    const response = await axios.post(`${API_BASE_URL}/groups`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating group:", error);
    throw new Error(
      error.response?.data?.message ||
        "No se pudo crear el grupo. Intenta nuevamente."
    );
  }
};
