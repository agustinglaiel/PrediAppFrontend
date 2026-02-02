import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import NavigationBar from "../components/NavigationBar";
import PostItem from "../components/foro/PostItem";
import CommentItem from "../components/foro/CommentItem";
import CommentPost from "../components/foro/CommentPost";
import usePost from "../hooks/usePost";
import { AuthContext } from "../contexts/AuthContext";

const PostPage = () => {
  const { postId } = useParams();
  const { post, loading, error, refresh } = usePost(postId);
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <NavigationBar />

      <main className="flex-grow pt-20 pb-24 px-4">
        {loading && <p>Cargando post…</p>}
        {error && (
          <p className="text-red-600">Error cargando post: {error.message}</p>
        )}

        {post && (
          <>
            <PostItem post={post} />

            {/* Siempre renderizamos el formulario, 
                pero lo deshabilitamos según isAuthenticated */}
            <CommentPost
              parentPostId={post.id}
              onCommentCreated={refresh}
              isDisabled={!isAuthenticated}
            />

            <div className="mt-6 space-y-4">
              {post.children?.map((c) => (
                <CommentItem
                  key={c.id}
                  comment={c}
                  onCommentCreated={refresh}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default PostPage;
