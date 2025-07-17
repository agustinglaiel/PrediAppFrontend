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
    try {
      await createPost({ userId: user.id, body, parentPostId });
      setBody("");
      onCommentCreated?.();  // Para refrescar la lista si quieres
    } catch (err) {
      // err.status lo pones en tu MessageStatus
      setStatus(err.status || 500);
      setErrorText(err.message);
    }
  };

  return (
    <div className="mt-6 px-4">
      <textarea
        rows={1}
        className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-blue-500 min-h-[60px] resize-none"
        placeholder="Escribe tu comentario..."
        value={body}
        onChange={(e) => setBody(e.target.value)}
        style={{
          height: 'auto',
          minHeight: '60px',
          maxHeight: '200px',
          overflow: 'hidden'
        }}
        onInput={(e) => {
          e.target.style.height = 'auto';
          e.target.style.height = e.target.scrollHeight + 'px';
        }}
      />
      <div className="flex justify-end gap-2 mt-2">
        <button
          onClick={() => setBody("")}
          className="px-3 py-1 text-red-500 hover:text-red-700 text-sm font-medium"
        >
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium"
        >
          Comentar
        </button>
      </div>
      {status != null && (
        <MessageStatus text={errorText} status={status} onHide={() => setStatus(null)} />
      )}
    </div>
  );
}

CommentPost.propTypes = {
  parentPostId:     PropTypes.number.isRequired,
  onCommentCreated: PropTypes.func, // opcional, si quieres refrescar
};