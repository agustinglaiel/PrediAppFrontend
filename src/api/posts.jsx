// src/api/posts.js
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080/api";

// Crear un post (o comentario si incluyes parentPostId)
export const createPost = async ({ userId, body, parentPostId = null }) => {
  try {
    if (!userId) throw new Error("User ID is required");
    if (!body) throw new Error("Body is required");

    const payload = {
      user_id: userId,
      body,
      ...(parentPostId != null ? { parent_post_id: parentPostId } : {}),
    };

    const { data } = await axios.post(
      `/posts`,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );
    return data;
  } catch (error) {
    console.error("Error creating post:", error);
    throw new Error(
      error.response?.data?.message || "Error creating post."
    );
  }
};

// Obtener un post por ID (incluye sus hilos hijos)
export const getPostById = async (id) => {
  try {
    const { data } = await axios.get(`/posts/${id}`);
    return data;
  } catch (error) {
    console.error("Error fetching post:", error);
    throw new Error(
      error.response?.data?.message || "Error fetching post."
    );
  }
};

// Listar posts principales con paginación
export const getPosts = async (offset = 0, limit = 10) => {
  try {
    const { data } = await axios.get(
      `/posts?offset=${offset}&limit=${limit}`
    );
    return data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error(
      error.response?.data?.message || "Error fetching posts."
    );
  }
};

// Listar posts de un usuario (solo principales) 
export const getPostsByUserId = async (userId) => {
  try {
    if (!userId) throw new Error("User ID is required");
    const { data } = await axios.get(`/posts/user/${userId}`);
    return data;
  } catch (error) {
    console.error("Error fetching user's posts:", error);
    throw new Error(
      error.response?.data?.message || "Error fetching user's posts."
    );
  }
};

// Eliminar un post (requiere enviar user_id en el body para verificar permisos)
export const deletePostById = async (postId, userId) => {
  try {
    if (!postId) throw new Error("Post ID is required");
    if (!userId) throw new Error("User ID is required");

    await axios.delete(`/posts/${postId}`, {
      headers: { "Content-Type": "application/json" },
      data: { user_id: userId },
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    throw new Error(
      error.response?.data?.message || "Error deleting post."
    );
  }
};

// Buscar posts por texto (full-text) con paginación
export const searchPosts = async (query, offset = 0, limit = 10) => {
  try {
    if (!query) throw new Error("Search query is required");
    const { data } = await axios.get(
      `/posts/search?query=${encodeURIComponent(query)}&offset=${offset}&limit=${limit}`
    );
    return data;
  } catch (error) {
    console.error("Error searching posts:", error);
    throw new Error(
      error.response?.data?.message || "Error searching posts."
    );
  }
};
