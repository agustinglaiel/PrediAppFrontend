import React, { useState } from "react";
import PropTypes from "prop-types";
import CommentPost from "./CommentPost";
import useUsersMap from "../../hooks/useUsersMap";
import PostMeta from "./PostMeta";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

export default function CommentItem({
  comment,
  level = 0,
  onCommentCreated,
}) {
  const { isAuthenticated } = useContext(AuthContext);
  const [showReply, setShowReply] = useState(false);
  const indent = level * 16; // px por nivel

  const { usersMap, loading: usersLoading } = useUsersMap([comment.user_id]);
  const author = usersMap[String(comment.user_id)];

  const handleReplyCreated = () => {
    setShowReply(false);
    onCommentCreated?.();
  };

  return (
    <div className="relative mb-4" style={{ paddingLeft: indent + 8 }}>
      {level > 0 && (
        <>
          <div
            className="absolute bg-gray-200"
            style={{ left: indent + 4, top: 0, height: 32, width: 2 }}
          />
          <div
            className="absolute bg-gray-200"
            style={{ left: indent + 4, top: 32, width: 8, height: 2 }}
          />
        </>
      )}

      <div className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 relative">
        {isAuthenticated && (
          <button
            onClick={() => setShowReply((prev) => !prev)}
            className="absolute right-2 text-gray-400 hover:text-gray-600"
            style={{ top: "50%", transform: "translateY(-50%)" }}
            title="Responder"
          >
            💬
          </button>
        )}

        <p className="text-gray-800 whitespace-pre-wrap break-words">
          {comment.body}
        </p>

        <PostMeta
          createdAt={comment.created_at}
          author={author}
          loadingAuthor={usersLoading}
        />
      </div>

      {showReply && isAuthenticated && (
        <CommentPost
          parentPostId={comment.id}
          onCommentCreated={handleReplyCreated}
        />
      )}

      {comment.children?.map((child) => (
        <CommentItem
          key={child.id}
          comment={child}
          level={level + 1}
          onCommentCreated={onCommentCreated}
        />
      ))}
    </div>
  );
}

CommentItem.propTypes = {
  comment: PropTypes.shape({
    id:         PropTypes.number.isRequired,
    body:       PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    user_id:    PropTypes.oneOfType([PropTypes.number, PropTypes.string])
      .isRequired,
    children:   PropTypes.array,
  }).isRequired,
  level:            PropTypes.number,
  onCommentCreated: PropTypes.func,
};
