import axios from "axios";
import * as jwtDecode from "jwt-decode";

axios.defaults.baseURL = "http://localhost:8080/api";
// axios.defaults.baseURL = "/api";

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
    const { data } = await axios.post('/signup', userData);
  // data = { id, first_name, last_name, username, email, role, score, token, created_at }
    const { token } = data;
    if (!token) throw new Error("No se recibió token en signup");

    // Guardar solo el JWT
    localStorage.setItem("jwtToken", token);
    setAuthToken(token);

    // Devolver la info pública (sin token)
    const { id, first_name, last_name, username, email, role, score, season_year, created_at } =
      data;
    return {
      token,
      id,
      first_name,
      last_name,
      username,
      email,
      role,
      score,
      season_year,
      created_at,
    };
  } catch (err) {
    console.error("Signup error:", err.response?.data || err.message);
  const backendMessage = err.response?.data?.message;
  const backendError = err.response?.data?.error;
  const normalizedMessage = backendMessage?.toLowerCase();

    if (backendError === "bad_request") {
      throw new Error(
        backendMessage || "Datos inválidos. Revisá los campos e intentá de nuevo."
      );
    }

    throw new Error(
      backendMessage || "Error al registrarse. Intentá de nuevo más tarde."
    );
  }
};

// Función de inicio de sesión que guarda el token en localStorage
export const login = async (userData) => {
  try {
    const { data } = await axios.post('/login', userData);
    // data = { id, first_name, last_name, username, email, role, score, token, created_at }
    const {
      token,
      id,
      first_name,
      last_name,
      username,
      email,
      role,
      score,
      season_year,
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
      score,
      season_year,
      created_at,
    };
  } catch (err) {
    console.error("Login error:", err.response?.data || err.message);
    const status = err.response?.status;
    const backendMessage = err.response?.data?.message;
    const backendError = err.response?.data?.error;

    // Mapear errores del backend a mensajes amigables
    if (status === 400 || backendError === "bad_request") {
      throw new Error("El mail o la contraseña son incorrectos. Por favor, intentá de nuevo.");
    }
    if (status === 404 || backendError === "not_found") {
      throw new Error("No se encontró una cuenta con ese email.");
    }
    if (status === 500 || backendError === "internal_server_error") {
      throw new Error("Error interno del servidor. Intentá de nuevo más tarde.");
    }

    throw new Error(
      "Error al iniciar sesión. Verificá tus credenciales o contactá al soporte."
    );
  }
};

export const logout = () => {
  localStorage.removeItem("jwtToken");
  setAuthToken(null);
  try{
    clearStoredScore();
  }catch{
  }
  window.location.reload();
};

// Obtener usuario por ID (requiere token en el encabezado)
export const getUserById = async (id) => {
  try {
    const token = localStorage.getItem("jwtToken");
    const response = await axios.get(`/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
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
    const res = await axios.put(`/users/${id}`, userData, {
      headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
    });
    return res.data;
  } catch (error) {
    console.error("Update user error:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "Error actualizando el usuario."
    );
  }
};

// Eliminar usuario por ID (requiere token en el encabezado)
export const deleteUserById = async (id) => {
  try {
    await axios.delete(`/users/${id}`);
  } catch (error) {
    console.error("Delete user error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error deleting user.");
  }
};

export const getUserScoreByUserId = async (userId, seasonYear) => {
  try {
    const params = seasonYear ? { season_year: seasonYear } : {};
    const res = await axios.get(`/users/${userId}/season-score`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
      params,
    });
    return { status: res.status, data: res.data };
  } catch (error) {
    if (error.response?.status === 404) {
      return { status: 404, data: null };
    }
    console.error("Error fetching user season score:", error);
    const err = new Error(
      error.response?.data?.message ||
        "Error al obtener el puntaje del usuario. Intenta nuevamente."
    );
    err.status = error.response?.status ?? 500;
    throw err;
  }
};

// Obtener todos los usuarios (requiere token en el encabezado)
export const getUsers = async () => {
  try {
    const response = await axios.get('/users/');
    return response.data;
  } catch (error) {
    console.error("Get users error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Error fetching users.");
  }
};

export const getScoreboard = async () => {
  try {
    const response = await axios.get('/users/scoreboard', {
      headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
    });
    return response.data;
  } catch (error) {
    console.error("Get scoreboard error:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "Error fetching scoreboard."
    );
  }
};

export const uploadProfilePicture = async (id, file) => {
  // Construyes el payload multipart/form-data
  const fd = new FormData();
  fd.append("profile_picture", file);          // ⬅️ nombre del campo que espera el backend

  try {
    const res = await axios.post(`/users/${id}/profile-picture`, fd, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (err) {
    console.error("Upload avatar error:", err.response?.data || err.message);
    throw new Error(
      err.response?.data?.message || "Error al subir la imagen de perfil."
    );
  }
};

export const fetchMe = async () => {
  try {
    // Asegúrate de haber llamado setAuthToken() tras login
    const { data } = await axios.get('/auth/me');
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
      season_year,
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
      seasonYear: season_year ?? null,
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

// ==================== PASSWORD RESET ====================

/**
 * Solicita un email de recuperación de contraseña.
 * NOTA: El backend siempre responde 200 OK por seguridad (no revela si el email existe).
 */
export const forgotPassword = async (email) => {
  try {
    const { data } = await axios.post('/forgot-password', { email });
    return data;
  } catch (err) {
    console.error("Forgot password error:", err.response?.data || err.message);
    const backendMessage = err.response?.data?.error;
    throw new Error(
      backendMessage || "Error al enviar la solicitud. Intentá de nuevo más tarde."
    );
  }
};

/**
 * Valida si un token de reset es válido antes de mostrar el formulario.
 */
export const validateResetToken = async (token) => {
  try {
    const { data } = await axios.post('/validate-reset-token', { token });
    return data; // { valid: boolean, message: string }
  } catch (err) {
    console.error("Validate token error:", err.response?.data || err.message);
    return { valid: false, message: "Error al validar el token" };
  }
};

/**
 * Establece una nueva contraseña usando el token de reset.
 */
export const resetPassword = async (token, newPassword) => {
  try {
    const { data } = await axios.post('/reset-password', {
      token,
      new_password: newPassword,
    });
    return data;
  } catch (err) {
    console.error("Reset password error:", err.response?.data || err.message);
    const backendError = err.response?.data?.error;
    
    if (backendError?.includes("invalid or expired")) {
      throw new Error("El link ha expirado o es inválido. Solicitá uno nuevo.");
    }
    if (backendError?.includes("at least 8 characters")) {
      throw new Error("La contraseña debe tener al menos 8 caracteres.");
    }
    
    throw new Error(
      backendError || "Error al restablecer la contraseña. Intentá de nuevo."
    );
  }
};

// Verificar si hay un token almacenado al cargar la aplicación
const token = localStorage.getItem("jwtToken");
if (token) {
  setAuthToken(token);
} else {
  console.warn("No se encontró un JWT Token almacenado");
}
