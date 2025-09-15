import { useParams } from "react-router-dom";
import { Box, Typography, Avatar, Card, CardContent, Modal, IconButton, } from "@mui/material";
import { usePosts } from "../../hooks/usePosts";
import { useState } from "react";

export default function PostPage() {
  const { plan, course, post: postId } = useParams<{
    plan: string;
    course: string;
    post: string;
  }>();

  const { data: posts, loading, error } = usePosts(plan, course);

  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (loading) return <Typography>Cargando post...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  const post = posts.find((p) => p._id === postId);
  if (!post) return <Typography>No se encontró el post</Typography>;

  const handleOpen = (index: number) => {
    setCurrentIndex(index);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? (post?.images?.length ?? 1) - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === (post?.images?.length ?? 1) - 1 ? 0 : prev + 1
    );
  };

  return (
    <>
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
                  onClick={() => handleOpen(i)}
                  sx={{
                    width: 150,
                    height: 100,
                    objectFit: "cover",
                    cursor: "pointer",
                    borderRadius: 1,
                  }}
                />
              ))}
              {post.images.length > 2 && (
                <Box
                  onClick={() => handleOpen(2)}
                  sx={{
                    width: 150,
                    height: 100,
                    bgcolor: "grey.300",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: "bold",
                    cursor: "pointer",
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

      {/* Modal de imágenes */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            bgcolor: "rgba(0,0,0,0.9)",
            position: "relative",
          }}
        >
          {/* Botón cerrar */}
          <IconButton
            onClick={handleClose}
            sx={{ position: "absolute", top: 16, right: 16, color: "white" }}
          >
            {"Close"}
          </IconButton>

          {/* Botón anterior */}
          {post.images && post.images.length > 1 && (
            <IconButton
              onClick={handlePrev}
              sx={{
                position: "absolute",
                left: 16,
                color: "white",
              }}
            >
              {"Back"}
            </IconButton>
          )}

          {/* Imagen principal */}
          <Box
            component="img"
            src={post.images?.[currentIndex]}
            alt={`expanded-img-${currentIndex}`}
            sx={{
              maxHeight: "80%",
              maxWidth: "90%",
              borderRadius: 2,
            }}
          />

          {/* Botón siguiente */}
          {post.images && post.images.length > 1 && (
            <IconButton
              onClick={handleNext}
              sx={{
                position: "absolute",
                right: 16,
                color: "white",
              }}
            >
              {"Forward"}
            </IconButton>
          )}
        </Box>
      </Modal>
    </>
  );
}
