import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

export const getGroupByUserId = async (userId) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/groups/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
    });
    return { status: res.status, data: res.data };
  } catch (error) {
    if (error.response?.status === 404) {
      return { status: 404, data: [] };
    }
    console.error("Error fetching groups:", error);
    const err = new Error(
      error.response?.data?.message ||
        "Error al obtener los grupos. Intenta nuevamente."
    );
    err.status = error.response?.status ?? 500;
    throw err;
  }
};

export const joinGroup = async (groupCode, userId) => {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/groups/join`,
      { group_code: groupCode, user_id: userId },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      }
    );
    return { status: res.status, message: res.data.message };
  } catch (error) {
    const err = new Error(
      error.response?.data?.message ||
        "Error al enviar solicitud para unirse al grupo."
    );
    err.status = error.response?.status ?? 500;
    throw err;
  }
};

export const createGroup = async ({ groupName, userId, description = "" }) => {
  try {
    const payload = {
      group_name: groupName,
      user_id: userId,
      ...(description && { description }),
    };

    const res = await axios.post(`${API_BASE_URL}/groups`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
    });

    return { status: res.status, data: res.data };
  } catch (error) {
    console.error("Error creating group:", error);
    const err = new Error(
      error.response?.data?.message || "No se pudo crear el grupo."
    );
    err.status = error.response?.status ?? 500;
    throw err;
  }
};
