import axios from "axios";

axios.defaults.baseURL = "/api";

// Función para obtener todos los pilotos desde el backend
export const getAllDrivers = async () => {
  try {
    const response = await axios.get("/drivers", {
      headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
    });
    return response.data; // Retorna los datos si todo va bien (ej. status 200)
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.warn(
        "API devolvió 404 en /drivers. Se asume que no hay pilotos y se retorna un array vacío."
      );
      return [];
    }
    console.error("Error fetching drivers - Detalle:", {
      message: error.message,
      code: error.code,
      config: error.config,
      request: error.request,
      response: error.response,
    });
    throw new Error(
      error.response?.data?.message ||
        "Error fetching drivers from the backend."
    );
  }
};

export const getDriverById = async (driverId) => {
  try {
    const response = await axios.get(`/drivers/${driverId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
    });
    return response.data; // Retorna el objeto ResponseDriverDTO
  } catch (error) {
    console.error(`Error fetching driver with ID ${driverId}:`, {
      message: error.message,
      response: error.response,
    });
    throw new Error(
      error.response?.data?.message || `Error fetching driver ${driverId}.`
    );
  }
};

export const createDriver = async (driverData) => {
  try {
    const response = await axios.post("/drivers", driverData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        "Content-Type": "application/json",
      },
    });
    return response.data; // Retorna el ResponseDriverDTO
  } catch (error) {
    console.error("Error creating driver - Detalle:", {
      message: error.message,
      response: error.response,
    });
    throw new Error(error.response?.data?.message || "Error creating driver."); // Lanza un error personalizado
  }
};

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
    console.error("Error updating driver - Detalle:", {
      message: error.message,
      response: error.response,
    });
    throw new Error(error.response?.data?.message || "Error updating driver.");
  }
};

export const fetchAllDriversFromExternalAPI = async () => {
  try {
    const response = await axios.get("/drivers/external", {
      headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
    });
    return response.data; // Retorna la lista de pilotos nuevos insertados
  } catch (error) {
    console.error("Error fetching drivers from external API - Detalle:", {
      message: error.message,
      code: error.code,
      config: error.config,
      request: error.request,
      response: error.response,
    });
    throw new Error(
      error.response?.data?.message ||
        "Error fetching drivers from external API."
    );
  }
};
