// src/components/PostItem.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function PostItem({ post }) {
  const nav = useNavigate();
  return (
    <div
      className="bg-white rounded-lg shadow p-4 mb-4 cursor-pointer hover:bg-gray-50"
      onClick={() => nav(`/foro/${post.id}`)}
    >
      <p className="text-gray-800">{post.body}</p>
      <div className="text-xs text-gray-500 mt-2">
        {new Date(post.created_at).toLocaleString()}
      </div>
    </div>
  );
}