// src/components/foro/CommentPost.jsx
import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "../../contexts/AuthContext";
import { createPost } from "../../api/posts";
import MessageStatus from "../MessageStatus";

export default function CommentPost({ parentPostId, onCommentCreated }) {
  const { user } = useContext(AuthContext);
  const [body, setBody]           = useState("");
  const [status, setStatus]       = useState(null);
  const [errorText, setErrorText] = useState("");

  const handleSubmit = async () => {
    if (!body.trim()) return; // no permitir si está vacío

    try {
      await createPost({ userId: user.id, body, parentPostId });
      setBody("");
      onCommentCreated?.();
    } catch (err) {
      setStatus(err.status || 500);
      setErrorText(err.message);
    }
  };

  const trimmed = body.trim();

  return (
    <div className="mt-6 px-4">
      <textarea
        rows={1}
        className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-blue-500 min-h-[60px] resize-none"
        placeholder="Escribe tu comentario..."
        value={body}
        onChange={(e) => setBody(e.target.value)}
        style={{
          height: "auto",
          minHeight: "60px",
          maxHeight: "200px",
          overflow: "hidden"
        }}
        onInput={(e) => {
          e.target.style.height = "auto";
          e.target.style.height = e.target.scrollHeight + "px";
        }}
      />
      <div className="flex justify-end gap-2 mt-2">
        {/* Mostrar el botón Cancelar solo si hay texto */}
        {trimmed && (
          <button
            onClick={() => setBody("")}
            className="px-3 py-1 text-red-500 hover:text-red-700 text-sm font-medium"
          >
            Cancelar
          </button>
        )}
        <button
          onClick={handleSubmit}
          disabled={!trimmed}
          className={`
            px-3 py-1 
            text-white rounded text-sm font-medium
            ${trimmed
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-blue-300 cursor-not-allowed"}
          `}
        >
          Comentar
        </button>
      </div>
      {status != null && (
        <MessageStatus
          text={errorText}
          status={status}
          onHide={() => setStatus(null)}
        />
      )}
    </div>
  );
}

CommentPost.propTypes = {
  parentPostId:     PropTypes.number.isRequired,
  onCommentCreated: PropTypes.func, // opcional, si quieres refrescar
};
