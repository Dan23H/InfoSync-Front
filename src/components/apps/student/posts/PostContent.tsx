import { Box, Typography, Avatar, Card, CardContent, Grid } from "@mui/material";
import CommentsSection from "../comments/CommentsSection";
import type { Post } from "../../../../models";
import { useAuthor } from "../../../../hooks/useAuthor";
import { useAuth } from "../../../../context";

interface PostContentProps {
  post: Post;
  onImageClick: (index: number) => void;
}

export default function PostContent({ post, onImageClick }: PostContentProps) {
  const { user: author, loading } = useAuthor(post.userId || null);
  const { user } = useAuth();

  return (
    <Card sx={{ backgroundColor: "#D9D9D9", p: 2 }}>
      <CardContent>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar sx={{ bgcolor: "brown", mr: 1 }} />
          <Typography variant="body2" fontWeight="bold">
            {author ? author.userName : loading ? "Cargando..." : "Desconocido"}
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
          <Grid container spacing={2} sx={{ mb: 2 }}>
            {post.images.slice(0, 3).map((img, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={i}>
                <Box
                  component="img"
                  src={img}
                  alt={`img-${i}`}
                  onClick={() => onImageClick(i)}
                  sx={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    cursor: "pointer",
                    borderRadius: 1,
                  }}
                />
              </Grid>
            ))}

            {post.images.length > 3 && (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <Box
                  onClick={() => onImageClick(3)}
                  sx={{
                    width: "100%",
                    height: "200px",
                    bgcolor: "grey.500",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                    cursor: "pointer",
                    borderRadius: 1,
                  }}
                >
                  +{post.images.length - 3}
                </Box>
              </Grid>
            )}
          </Grid>
        )}

        {/* Archivos */}
        {post.files && post.files.length > 0 && (
          <>
            <Typography variant="subtitle1" fontWeight="bold">
              Documentos Adjuntos
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
              {post.files.slice(0, 5).map((file, i) => (
                <a key={i} href={file} download target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: "grey.200",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 1,
                      p: 1,
                    }}
                  >
                    {file.endsWith(".pdf") ? "PDF" : "Archivo"}
                  </Box>
                </a>
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

      {/* Comentarios */}
      <CommentsSection
        postId={post._id}
        userId={user._id}
        likeCount={post.likeCount}
        dislikeCount={post.dislikeCount}
        onCommentCountChange={() => {}}
      />
    </Card>
  );
}
