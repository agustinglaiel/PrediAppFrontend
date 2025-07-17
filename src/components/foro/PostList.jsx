// src/components/foro/PostList.jsx
import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const PostList = ({ posts }) => {
  const nav = useNavigate();

  if (!posts || posts.length === 0) {
    return (
      <p className="text-gray-600 text-center mt-6">
        Ups, cuánto vacío…
      </p>
    );
  }

  return (
    <>
      {posts.map((post) => (
        <div
          key={post.id}
          className="border-b last:border-none py-4 cursor-pointer"
          onClick={() => nav(`/foro/${post.id}`)}
        >
          <div className="px-4">
            <p
              className="
                text-gray-800
                text-base
                leading-relaxed
                line-clamp-5
                overflow-hidden
                break-words
              "
            >
              {post.body}
            </p>
          </div>
          <p className="px-4 text-xs text-gray-500 mt-2">
            {new Date(post.created_at).toLocaleString()}
          </p>
        </div>
      ))}
    </>
  );
};

PostList.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      id:          PropTypes.number.isRequired,
      body:        PropTypes.string.isRequired,
      created_at:  PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default PostList;
