// src/components/foro/CommentItem.jsx
import React from "react";
import PropTypes from "prop-types";

export default function CommentItem({ comment, level = 0 }) {
  const indent = level * 16; // px por nivel
  const barThickness = 2;    // grosor de la línea

  return (
    <div className="relative mb-4" style={{ paddingLeft: indent + 8 }}>
      {/* Vertical line: solo desde el top hasta el centro */}
      {level > 0 && (
        <div
          className="absolute bg-gray-200"
          style={{
            left: indent + 4,
            top: 0,
            height: `calc(50% - ${barThickness / 2}px)`,
            width: `${barThickness}px`,
          }}
        />
      )}

      {/* Horizontal “pata” de la L, justo en el medio */}
      {level > 0 && (
        <div
          className="absolute bg-gray-200"
          style={{
            left: indent + 4,
            top: "50%",
            transform: `translateY(-${barThickness / 2}px)`,
            width: 8,
            height: `${barThickness}px`,
          }}
        />
      )}

      <div className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 cursor-default">
        <p className="text-gray-800 whitespace-pre-wrap break-words">
          {comment.body}
        </p>
        <div className="text-xs text-gray-500 mt-2">
          {new Date(comment.created_at).toLocaleString()}
        </div>
      </div>

      {/* Recursión para hijos */}
      {comment.children?.map((child) => (
        <CommentItem key={child.id} comment={child} level={level + 1} />
      ))}
    </div>
  );
}

CommentItem.propTypes = {
  comment: PropTypes.shape({
    id:         PropTypes.number.isRequired,
    body:       PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    children:   PropTypes.array,
  }).isRequired,
  level: PropTypes.number,
};
