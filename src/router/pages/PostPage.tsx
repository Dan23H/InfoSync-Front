import { useParams } from "react-router-dom";
import { Grid, Typography } from "@mui/material";
import { usePosts } from "../../hooks/usePosts";
import { useState, useContext, useEffect } from "react";
import { ImageModal, PostContent, PostSidebar } from "../../components/apps/student/posts";
import ErrorAlert from "../../components/common/ErrorAlert";
import { useSocket } from "../../hooks/useSocket";
import SocketContext from "../../context/SocketContext";

const WSS_API_URL = import.meta.env.WSS_API_URL || "ws://localhost:3000";

export default function PostPage() {
  const { plan, course, post: postId } = useParams<{ plan: string; course: string; post: string }>();
  const { data: posts, loading, error } = usePosts(plan, course);
  // const userId = localStorage.getItem("userId") || undefined;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [openImages, setOpenImages] = useState(false);

  const { SocketDispatch } = useContext(SocketContext);
  const token = localStorage.getItem("jwt");
  const user = localStorage.getItem("user");
  const socket = useSocket(WSS_API_URL, {
    autoConnect: false,
    reconnectionAttempts: 5,
    reconnectionDelay: 5000,
  });

  useEffect(() => {
    if (token && user) {
      socket.io.opts.query = { token, user };
      socket.connect();
      SocketDispatch({ type: "update_socket", payload: socket });
    } else {
      console.error("Missing token or user in localStorage. Socket will not connect.");
    }

    return () => {
      socket.disconnect();
    };
  }, [socket, SocketDispatch, token, user]);

  if (loading) return <Typography>Cargando post...</Typography>;
  if (error) return (
    <ErrorAlert
      message={error}
      actionLabel="Intentar de nuevo"
      onAction={() => window.location.reload()}
    />
  );

  const post = posts.find((p) => p._id === postId);
  if (!post) return <Typography>No se encontró el post</Typography>;

  return (
    <Grid container spacing={2}>
      {/* Sidebar */}
      <Grid size={{ xs: 12, md: 3 }}>
        <PostSidebar posts={posts} postId={postId} plan={plan!} course={course!} />
      </Grid>

      {/* Contenido principal */}
      <Grid size={{ xs: 12, md: 9 }} sx={{ height: "98vh", overflowY: "auto" }}>
        <PostContent
          post={post}
          onImageClick={(i) => {
            setCurrentIndex(i);
            setOpenImages(true);
          }}
        />
      </Grid>

      {/* Modal de imágenes */}
      <ImageModal
        images={post.images || []}
        open={openImages}
        currentIndex={currentIndex}
        onClose={() => setOpenImages(false)}
        onPrev={() =>
          setCurrentIndex((prev) => (prev === 0 ? post.images.length - 1 : prev - 1))
        }
        onNext={() =>
          setCurrentIndex((prev) => (prev === post.images.length - 1 ? 0 : prev + 1))
        }
        setCurrentIndex={setCurrentIndex}
      />
    </Grid>
  );
}
