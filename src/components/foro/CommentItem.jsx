// src/components/foro/CommentItem.jsx
import React from "react";
import PropTypes from "prop-types";

export default function CommentItem({ comment, level = 0 }) {
  const indent = level * 16; // px por nivel

  return (
    <div className="relative mb-4" style={{ paddingLeft: indent + 8 }}>
      {/* Vertical line - solo hasta donde empieza la L */}
      {level > 0 && (
        <div
          className="absolute bg-gray-200"
          style={{
            left: indent + 4, // ajustar para centrar la línea
            top: 0,
            height: 32, // Solo hasta donde empieza la L (aproximadamente la mitad del elemento)
            width: 2,
          }}
        />
      )}
      {/* Horizontal connector at middle (la pata de la L) */}
      {level > 0 && (
        <div
          className="absolute bg-gray-200"
          style={{
            left: indent + 4,
            top: 32,      // Más abajo, centrado en el elemento
            width: 8,
            height: 2,
          }}
        />
      )}

      <div
        className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 cursor-default"
      >
        <p className="text-gray-800 whitespace-pre-wrap break-words">
          {comment.body}
        </p>
        <div className="text-xs text-gray-500 mt-2">
          {new Date(comment.created_at).toLocaleString()}
        </div>
      </div>

      {/* Recursión para hijos */}
      {comment.children?.map((child) => (
        <CommentItem
          key={child.id}
          comment={child}
          level={level + 1}
        />
      ))}
    </div>
  );
}

CommentItem.propTypes = {
  comment: PropTypes.shape({
    id:            PropTypes.number.isRequired,
    body:          PropTypes.string.isRequired,
    created_at:    PropTypes.string.isRequired,
    children:      PropTypes.array,
  }).isRequired,
  level: PropTypes.number,
};