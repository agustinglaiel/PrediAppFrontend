import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import useUsersMap from "../../hooks/useUsersMap";
import PostMeta from "./PostMeta";

const PostList = ({ posts }) => {
  const nav = useNavigate();
  const userIds = posts.map((p) => p.user_id).filter((id) => id != null);
  const { usersMap, loading: usersLoading } = useUsersMap(userIds);

  if (!posts || posts.length === 0) {
    return (
      <p className="text-gray-600 text-center mt-6">Ups, cuánto vacío…</p>
    );
  }

  return (
    <>
      {posts.map((post) => {
        const author = usersMap[String(post.user_id)];
        return (
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
              <PostMeta
                createdAt={post.created_at}
                author={author}
                loadingAuthor={usersLoading}
              />
            </div>
          </div>
        );
      })}
    </>
  );
};

PostList.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      id:         PropTypes.number.isRequired,
      body:       PropTypes.string.isRequired,
      created_at: PropTypes.string.isRequired,
      user_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
    })
  ).isRequired,
};

export default PostList;
