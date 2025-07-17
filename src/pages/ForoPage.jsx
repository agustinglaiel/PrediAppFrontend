import React, { useState, useContext } from "react";
import Header from "../components/Header";
import NavigationBar from "../components/NavigationBar";
import usePosts from "../hooks/usePosts";
import PostList from "../components/foro/PostList";
import NewPostModal from "../components/foro/NewPostModal";
import { createPost } from "../api/posts";
import { AuthContext } from "../contexts/AuthContext";

const ForoPage = () => {
  const { user }               = useContext(AuthContext);
  const { posts, loading, error } = usePosts(0, 20);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <NavigationBar />

      <main className="flex-grow pt-20 pb-8 px-4">
        {loading ? (
          <p>Cargando posts…</p>
        ) : error ? (
          <p className="text-red-600">Error: {error.message}</p>
        ) : (
          <PostList posts={posts} />
        )}

        {/* FAB */}
        <button
          onClick={() => setShowModal(true)}
          className="fixed bottom-24 right-4 w-12 h-12 bg-red-600 rounded-full shadow-lg text-white text-3xl flex items-center justify-center z-50 leading-none pb-1"
          title="Nuevo post"
        >
          +
        </button>

        {showModal && (
          <NewPostModal
            userId={user.id}
            onClose={() => setShowModal(false)}
            onSubmit={createPost}
          />
        )}
      </main>

      <footer className="bg-gray-200 text-gray-700 text-center py-3 text-sm">
        <p>© 2025 PrediApp</p>
      </footer>
    </div>
  );
};

export default ForoPage;
