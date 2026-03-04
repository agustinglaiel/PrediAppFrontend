import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080/api";
// axios.defaults.baseURL = "/api";

// Obtener todos los pilotos
export const getAllDrivers = async () => {
  try {
    const response = await axios.get("/drivers", {
      headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.warn(
        "API devolvió 404 en /drivers. Se asume que no hay pilotos y se retorna un array vacío."
      );
      return [];
    }
    console.error("Error fetching drivers:", {
      message: error.message,
      response: error.response?.data,
    });
    throw new Error(
      error.response?.data?.message ||
        "Error fetching drivers from the backend."
    );
  }
};

// Obtener un piloto por ID
export const getDriverById = async (driverId) => {
  try {
    const response = await axios.get(`/drivers/${driverId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching driver with ID ${driverId}:`, {
      message: error.message,
      response: error.response?.data,
    });
    throw new Error(
      error.response?.data?.message || `Error fetching driver ${driverId}.`
    );
  }
};

// Obtener un piloto por número
export const getDriverByNumber = async (driverNumber) => {
  try {
    const response = await axios.get(`/drivers/number/${driverNumber}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching driver with number ${driverNumber}:`, {
      message: error.message,
      response: error.response?.data,
    });
    throw new Error(
      error.response?.data?.message ||
        `Error fetching driver with number ${driverNumber}.`
    );
  }
};

// Buscar pilotos por nombre completo (búsqueda parcial)
export const getDriversByFullName = async (fullName) => {
  try {
    const response = await axios.get(
      `/drivers/fullname/${encodeURIComponent(fullName)}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error searching drivers by name "${fullName}":`, {
      message: error.message,
      response: error.response?.data,
    });
    throw new Error(
      error.response?.data?.message || `Error searching drivers by name.`
    );
  }
};

// Crear un piloto
export const createDriver = async (driverData) => {
  try {
    const response = await axios.post("/drivers", driverData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating driver:", {
      message: error.message,
      response: error.response?.data,
    });
    throw new Error(error.response?.data?.message || "Error creating driver.");
  }
};

// Actualizar un piloto (parcial — solo se envían campos con valor)
export const updateDriver = async (driverId, driverData) => {
  try {
    const response = await axios.put(`/drivers/${driverId}`, driverData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating driver:", {
      message: error.message,
      response: error.response?.data,
    });
    throw new Error(error.response?.data?.message || "Error updating driver.");
  }
};

// Eliminar un piloto
export const deleteDriver = async (driverId) => {
  try {
    const response = await axios.delete(`/drivers/${driverId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting driver ${driverId}:`, {
      message: error.message,
      response: error.response?.data,
    });
    throw new Error(
      error.response?.data?.message || `Error deleting driver ${driverId}.`
    );
  }
};

