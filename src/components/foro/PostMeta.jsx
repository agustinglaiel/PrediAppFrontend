import React from "react";
import PropTypes from "prop-types";

export default function PostMeta({ createdAt, author, loadingAuthor }) {
  return (
    <div className="text-xs text-gray-500 mt-2 flex flex-wrap gap-2">
      {loadingAuthor ? (
        <span>Cargando autor…</span>
      ) : (
        <span className="font-medium">
          u/{author?.username || "Usuario desconocido"}
        </span>
      )}
      <span>-</span>
      <span>{new Date(createdAt).toLocaleString()}</span>
    </div>
  );
}

PostMeta.propTypes = {
  createdAt: PropTypes.string.isRequired,
  author: PropTypes.shape({
    username: PropTypes.string,
  }),
  loadingAuthor: PropTypes.bool,
};
