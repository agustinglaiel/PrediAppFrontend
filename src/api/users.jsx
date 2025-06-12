import axios from "axios";
import * as jwtDecode from "jwt-decode";

const API_URL = "http://localhost:8080";

// Función para establecer el token JWT en el encabezado de autorización
export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

export function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

// Función de registro que guarda el token en localStorage
export const signUp = async (userData) => {
  try {
    const { data } = await axios.post(
      "http://localhost:8080/api/signup",
      userData
    );
    // data = { id, first_name, last_name, username, email, role, token, created_at }
    const { token } = data;
    if (!token) throw new Error("No se recibió token en signup");

    // Guardar solo el JWT
    localStorage.setItem("jwtToken", token);
    setAuthToken(token);

    // Devolver la info pública (sin token)
    const { id, first_name, last_name, username, email, role, created_at } =
      data;
    return { id, first_name, last_name, username, email, role, created_at };
  } catch (err) {
    console.error("Signup error:", err.response?.data || err.message);
    throw new Error(err.response?.data?.error || "Error al registrarse");
  }
};

// Función de inicio de sesión que guarda el token en localStorage
export const login = async (userData) => {
  try {
    const { data } = await axios.post(
      "http://localhost:8080/api/login",
      userData
    );
    // data = { id, first_name, last_name, username, email, role, token, created_at }
    const {
      token,
      id,
      first_name,
      last_name,
      username,
      email,
      role,
      created_at,
    } = data;
    if (!token) throw new Error("No se recibió token en login");

    // Guardar solo el JWT
    localStorage.setItem("jwtToken", token);
    setAuthToken(token);

    // Devolver toda la info (incluido el token)
    return {
      token,
      id,
      first_name,
      last_name,
      username,
      email,
      role,
      created_at,
    };
  } catch (err) {
    console.error("Login error:", err.response?.data || err.message);
    throw new Error(err.response?.data?.error || "Error al iniciar sesión");
  }
};

export const logout = () => {
  localStorage.removeItem("jwtToken");
  setAuthToken(null);
};

// Obtener usuario por ID (requiere token en el encabezado)
export const getUserById = async (id) => {
  try {
    const token = localStorage.getItem("jwtToken");
    const response = await axios.get(`${API_URL}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Get user error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error fetching user.");
  }
};

// Actualizar usuario por ID (requiere token en el encabezado)
export const updateUserById = async (id, userData) => {
  try {
    const response = await axios.put(`${API_URL}/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error("Update user error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error updating user.");
  }
};

// Eliminar usuario por ID (requiere token en el encabezado)
export const deleteUserById = async (id) => {
  try {
    await axios.delete(`${API_URL}/users/${id}`);
  } catch (error) {
    console.error("Delete user error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error deleting user.");
  }
};

// Obtener todos los usuarios (requiere token en el encabezado)
export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/`);
    return response.data;
  } catch (error) {
    console.error("Get users error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error fetching users.");
  }
};

export const fetchMe = async () => {
  try {
    // Asegúrate de haber llamado setAuthToken() tras login
    const { data } = await axios.get("/api/auth/me");
    // data = { id, first_name, last_name, username, email, role, score, expires_at }
    return data;
  } catch (err) {
    console.error("fetchMe error:", err.response?.data || err.message);
    throw err;
  }
};

export function getUserFromToken() {
  const token = localStorage.getItem("jwtToken");
  if (!token) return null;
  try {
    const {
      user_id,
      first_name,
      last_name,
      username,
      email,
      role,
      score,
      exp,
    } = jwtDecode(token);
    return {
      id: user_id,
      firstName: first_name,
      lastName: last_name,
      username,
      email,
      role,
      score,
      exp,
    };
  } catch {
    return null;
  }
}

axios.interceptors.response.use(
  (res) => res,
  (err) => {
    // Si recibes 401, probablemente el token expiró: limpias y rediriges
    if (err.response?.status === 401) {
      logout();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// Verificar si hay un token almacenado al cargar la aplicación
const token = localStorage.getItem("jwtToken");
if (token) {
  setAuthToken(token);
  console.log("JWT Token establecido desde almacenamiento local");
} else {
  console.warn("No se encontró un JWT Token almacenado");
}
