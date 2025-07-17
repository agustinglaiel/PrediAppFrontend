// src/pages/PostThreadPage.jsx
import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import NavigationBar from "../components/NavigationBar";
import usePostThread from "../hooks/usePostThread";
import { createPost } from "../api/posts";
import { AuthContext } from "../contexts/AuthContext";

function Comment({ comment, depth = 0 }) {
  const [replying, setReplying] = useState(false);
  const [body, setBody] = useState("");
  const { user } = useContext(AuthContext);

  const submitReply = async () => {
    if (!body) return;
    await createPost({
      userId: user.id,
      body,
      parentPostId: comment.id,
    });
    window.location.reload(); // o mejor: refetch del hilo
  };

  return (
    <div className={`ml-${depth * 4} mt-4`}>
      <div className="bg-gray-100 p-3 rounded">
        <p>{comment.body}</p>
        <div className="text-xs text-gray-500">
          {comment.user_id} —{" "}
          {new Date(comment.created_at).toLocaleString()}
        </div>
      </div>
      <button
        className="text-blue-600 text-sm mt-1"
        onClick={() => setReplying(!replying)}
      >
        {replying ? "Cancelar" : "Responder"}
      </button>
      {replying && (
        <div className="mt-2 flex gap-2">
          <input
            className="flex-1 border px-2"
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="Tu respuesta…"
          />
          <button
            className="bg-green-600 text-white px-3 rounded"
            onClick={submitReply}
          >
            Enviar
          </button>
        </div>
      )}
      {/* recursión para hijos */}
      {comment.children.map(child => (
        <Comment key={child.id} comment={child} depth={depth + 1} />
      ))}
    </div>
  );
}

export default function PostThreadPage() {
  const { postId } = useParams();
  const { thread, loading } = usePostThread(postId);
  const { user } = useContext(AuthContext);
  const [body, setBody] = useState("");

  const submitComment = async () => {
    if (!body) return;
    await createPost({ userId: user.id, body, parentPostId: null });
    window.location.reload();
  };

  if (loading) return <p>Cargando hilo…</p>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <NavigationBar />
      <main className="flex-grow pt-24 px-4">
        {/* hilo principal */}
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-lg font-medium mb-2">{thread.body}</p>
          <div className="text-xs text-gray-500">
            {thread.user_id} —{" "}
            {new Date(thread.created_at).toLocaleString()}
          </div>
        </div>

        {/* formulario de comentario al hilo */}
        <div className="mt-6 flex gap-2">
          <input
            className="flex-1 border px-2"
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="Escribe un comentario…"
          />
          <button
            className="bg-blue-600 text-white px-4 rounded"
            onClick={submitComment}
          >
            Comentar
          </button>
        </div>

        {/* comentarios recursivos */}
        <div className="mt-6">
          {thread.children.map(c => (
            <Comment key={c.id} comment={c} />
          ))}
        </div>
      </main>
      <footer className="bg-gray-200 text-gray-700 text-center py-3 text-sm">
        <p>© 2025 PrediApp</p>
      </footer>
    </div>
  );
}
