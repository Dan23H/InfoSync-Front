import { useParams } from "react-router-dom";
import { Box, Typography, Avatar, Card, CardContent } from "@mui/material";
import { usePosts } from "../../hooks/usePosts";

export default function PostPage() {
  const { plan, course, post: postId } = useParams<{
    plan: string;
    course: string;
    post: string;
  }>();

  const { data: posts, loading, error } = usePosts(plan, course);

  if (loading) return <Typography>Cargando post...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  const post = posts.find((p) => p._id === postId);
  if (!post) return <Typography>No se encontró el post</Typography>;

  return (
    <Card sx={{ backgroundColor: "#e0e0e0", p: 2 }}>
      <CardContent>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar sx={{ bgcolor: "brown", mr: 1 }} />
          <Typography variant="body2" fontWeight="bold">
            {post.userId}
          </Typography>
          <Typography variant="body2" sx={{ ml: 1 }}>
            {new Date(post.createdAt).toLocaleDateString()}
          </Typography>
        </Box>

        {/* Título y descripción */}
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {post.title}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {post.description}
        </Typography>

        {/* Imágenes */}
        {post.images && post.images.length > 0 && (
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            {post.images.slice(0, 2).map((img, i) => (
              <Box
                key={i}
                component="img"
                src={img}
                alt={`img-${i}`}
                sx={{ width: 150, height: 100, objectFit: "cover" }}
              />
            ))}
            {post.images.length > 2 && (
              <Box
                sx={{
                  width: 150,
                  height: 100,
                  bgcolor: "grey.300",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontWeight: "bold",
                }}
              >
                +{post.images.length - 2}
              </Box>
            )}
          </Box>
        )}

        {/* Archivos */}
        {post.files && post.files.length > 0 && (
          <>
            <Typography variant="subtitle1" fontWeight="bold">
              Documentos Adjuntos
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
              {post.files.slice(0, 5).map((file, i) => (
                <Box
                  key={i}
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: "grey.200",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {file.endsWith(".pdf") ? "PDF" : "File"}
                </Box>
              ))}
              {post.files.length > 5 && (
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: "grey.300",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: "bold",
                  }}
                >
                  +{post.files.length - 5}
                </Box>
              )}
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
}
