import { useParams } from "react-router-dom";
import { Grid, Typography } from "@mui/material";
import { usePosts } from "../../hooks/usePosts";
import { useState } from "react";
import { ImageModal, PostContent, PostSidebar } from "../../components/apps/student/posts";

export default function PostPage() {
  const { plan, course, post: postId } = useParams<{ plan: string; course: string; post: string }>();
  const { data: posts, loading, error } = usePosts(plan, course);

  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (loading) return <Typography>Cargando post...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

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
        <PostContent post={post} onImageClick={(i) => { setCurrentIndex(i); setOpen(true); }} />
      </Grid>

      {/* Modal de imágenes */}
      <ImageModal
        images={post.images || []}
        open={open}
        currentIndex={currentIndex}
        onClose={() => setOpen(false)}
        onPrev={() => setCurrentIndex((prev) => (prev === 0 ? post.images.length - 1 : prev - 1))}
        onNext={() => setCurrentIndex((prev) => (prev === post.images.length - 1 ? 0 : prev + 1))}
        setCurrentIndex={setCurrentIndex}
      />
    </Grid>
  );
}
