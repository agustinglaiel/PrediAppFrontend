import React from "react";
import { useNavigate } from "react-router-dom";
import useUsersMap from "../../hooks/useUsersMap";
import PostMeta from "./PostMeta";

export default function PostItem({ post }) {
  const nav = useNavigate();
  const { usersMap, loading: usersLoading } = useUsersMap([post.user_id]);
  const author = usersMap[String(post.user_id)];

  return (
    <div
      className="bg-white rounded-lg shadow p-4 mb-4 cursor-pointer hover:bg-gray-50"
      onClick={() => nav(`/foro/${post.id}`)}
    >
      <p className="text-gray-800">{post.body}</p>
      <PostMeta
        createdAt={post.created_at}
        author={author}
        loadingAuthor={usersLoading}
      />
    </div>
  );
}
