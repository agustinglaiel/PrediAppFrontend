// src/pages/PostPage.jsx
import React from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import NavigationBar from "../components/NavigationBar";
import PostItem from "../components/foro/PostItem";
import CommentItem from "../components/foro/CommentItem";
import usePost from "../hooks/usePost";
import CommentPost from "../components/foro/CommentPost";

const PostPage = () => {
  const { postId } = useParams();
  const { post, loading, error, refresh } = usePost(postId);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <NavigationBar />

      <main className="flex-grow pt-20 px-4">
        {loading && <p>Cargando post…</p>}
        {error && (
          <p className="text-red-600">Error cargando post: {error.message}</p>
        )}

        {post && (
          <>
            <PostItem post={post} />

            {/* Form para nuevo comentario */}
            <CommentPost
              parentPostId={post.id}
              onCommentCreated={refresh}
            />

            {/* Aquí los comentarios recursivos */}
            <div className="mt-6">
              {post.children?.map((c) => (
                <CommentItem key={c.id} comment={c} />
              ))}
            </div>
          </>
        )}
      </main>

      <footer className="bg-gray-200 text-gray-700 text-center py-3 text-sm">
        <p>© 2025 PrediApp</p>
      </footer>
    </div>
  );
};

export default PostPage;
