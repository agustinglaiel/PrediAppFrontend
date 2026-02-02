// src/pages/ForoPage.jsx
import React, { useState, useContext, useRef, useEffect } from "react";
import Header from "../components/Header";
import NavigationBar from "../components/NavigationBar";
import usePosts from "../hooks/usePosts";
import useSearchPost from "../hooks/useSearchPost";
import PostList from "../components/foro/PostList";
import NewPostModal from "../components/foro/NewPostModal";
import { createPost } from "../api/posts";
import { AuthContext } from "../contexts/AuthContext";

const ForoPage = () => {
  const { user, isAuthenticated } = useContext(AuthContext);

  // posts "normales"
  const {
    posts,
    loading: postsLoading,
    error: postsError,
    refresh,
  } = usePosts(0, 100);

  // búsqueda con debounce
  const {
    query,
    setQuery,
    results,
    loading: searchLoading,
    error: searchError,
  } = useSearchPost("", 0, 100);

  const [showModal, setShowModal] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const inputRef = useRef(null);

  // autofocus cuando aparece el input
  useEffect(() => {
    if (showSearch && inputRef.current) inputRef.current.focus();
  }, [showSearch]);

  // cerrar modal y refrescar
  const handleCloseModal = () => {
    setShowModal(false);
    refresh();
  };

  // elección entre lista normal o búsqueda
  const isSearching = showSearch && query;
  const displayedPosts = isSearching ? results : posts;
  const isLoading = isSearching ? searchLoading : postsLoading;
  const displayError = isSearching ? searchError : postsError;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <NavigationBar />

      <main className="flex-grow pt-20 pb-8 px-4">
        {/* 1) Input de búsqueda */}
        {showSearch && (
          <div className="mb-4">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar posts..."
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-blue-500"
            />
          </div>
        )}

        {/* 2) Estado de carga / error / lista */}
        {isLoading ? (
          <p>Cargando posts…</p>
        ) : displayError ? (
          <p className="text-red-600">Error: {displayError.message}</p>
        ) : (
          <PostList posts={displayedPosts} />
        )}

        {/* 3) Botón de búsqueda */}
        <button
          onClick={() => setShowSearch((prev) => !prev)}
          className="fixed bottom-40 right-4 w-12 h-12 bg-red-600 rounded-full shadow-lg text-white text-2xl flex items-center justify-center z-50"
          title="Buscar posts"
        >
          🔍
        </button>

        {/* 4) FAB para nuevo post, solo si está autenticado */}
        <button
          onClick={() => isAuthenticated && setShowModal(true)}
          disabled={!isAuthenticated}
          title={
            isAuthenticated
              ? "Crear nuevo post"
              : "Debes iniciar sesión para publicar"
          }
          className={`
            fixed bottom-24 right-4 w-12 h-12 rounded-full shadow-lg text-white text-3xl flex items-center justify-center z-50 pb-1
            ${isAuthenticated ? "bg-red-600 hover:bg-red-700" : "bg-gray-400 cursor-not-allowed"}
          `}
        >
          +
        </button>

        {/* 5) Modal de nuevo post, solo si user autenticado */}
        {showModal && isAuthenticated && (
          <NewPostModal
            userId={user.id}
            onClose={handleCloseModal}
            onSubmit={createPost}
          />
        )}
      </main>

      <footer className="bg-gray-200 text-gray-700 text-center py-3 text-sm">
        <p>© 2026 PrediApp</p>
      </footer>
    </div>
  );
};

export default ForoPage;
