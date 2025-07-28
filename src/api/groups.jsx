import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080/api";

export const getGroupById = async (groupId) => {
  try{
    const res = await axios.get(`/groups/${groupId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
    });
    return { status: res.status, data: res.data };
  } catch (error) {
    if (error.response?.status === 404) {
      return { status: 404, data: null };
    }
    console.error("Error fetching group:", error);
    const err = new Error(
      error.response?.data?.message ||
        "Error al obtener el grupo. Intenta nuevamente."
    );
    err.status = error.response?.status ?? 500;
    throw err;
  }
}

export const getGroupByUserId = async (userId) => {
  try {
    const res = await axios.get(`/groups/user/${userId}`, {
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

export const getJoinRequestByGroupId = async (groupId) => {
  try {
    const res = await axios.get(`/groups/${groupId}/join-requests`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },  
  });
  return { status: res.status, data: res.data };
  } catch (error) {
    if (error.response?.status === 404) {
      return { status: 404, data: [] };
    }
    console.error("Error fetching join requests:", error);
    const err = new Error(
      error.response?.data?.message ||
        "Error al obtener las solicitudes de unión al grupo. Intenta nuevamente."
    );
    err.status = error.response?.status ?? 500;
    throw err;
  }
};

export const joinGroup = async (groupCode, userId) => {
  try {
    const res = await axios.post(
      `/groups/join`,
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

    const res = await axios.post(`/groups`, payload, {
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

export const manageGroupInvitation = async ({
  groupId,
  creatorId,
  targetUserId,
  action,
}) => {
  try {
    const res = await axios.post(
      `/groups/manage-invitation`,
      {
        group_id: groupId,
        creator_id: creatorId,
        target_user_id: targetUserId,
        action,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      }
    );
    return { status: res.status, message: res.data.message };
  } catch (error) {
    console.error("Error managing invitation:", error);
    const err = new Error(
      error.response?.data?.message ||
        "Error al gestionar la invitación. Intenta nuevamente."
    );
    err.status = error.response?.status ?? 500;
    throw err;
  }
};