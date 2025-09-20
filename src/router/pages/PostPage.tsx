import { useParams, Link } from "react-router-dom";
import { Box, Typography, Avatar, Card, CardContent, Modal, IconButton, List, ListItem, Divider, Grid } from "@mui/material";
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
  const [visited, setVisited] = useState<string[]>([]);


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

  const handlePostClick = (postId: string) => {
    setVisited((prev) => [...new Set([...prev, postId])]); // marcar como visitado
  };


  return (
    <Grid container spacing={2} sx={{ height: "100vh", overflowY: "hidden" }}>
      {/* Sidebar de publicaciones */}
      <Grid size={{ xs: 12, md: 3 }} sx={{ height: "100%" }}>
        <Typography variant="h6" gutterBottom position={"sticky"} align="center">
          Publicaciones de {course}
        </Typography>
        <Divider />
        <Card sx={{ height: "100%", overflowY: "auto" }}>
          <CardContent>
            <List>
              {posts
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) // ordenar por fecha
                .map((p) => (
                  <ListItem
                    key={p._id}
                    alignItems="flex-start"
                    onClick={() => handlePostClick(p._id)}
                    component={Link}
                    to={`/student/${plan}/${course}/${p._id}`}
                    sx={{
                      textDecoration: "none",
                      bgcolor: p._id === postId ? "grey.200" : "transparent",
                      borderRadius: 1,
                      mb: 1,
                      "&:hover": { bgcolor: "grey.100" },
                      color: visited.includes(p._id) ? "text.secondary" : "text.primary",
                      flexDirection: "column",
                      alignItems: "stretch",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                      <Avatar sx={{ width: 15, height: 15, mr: 1 }} />
                      <Typography variant="body2" fontWeight="bold">
                        {p.userId}
                      </Typography>
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {new Date(p.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>

                    <Typography variant="subtitle1" fontWeight="bold">
                      {p.title}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" noWrap>
                      {p.description}
                    </Typography>

                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
                      <Typography variant="caption">
                        {0} comentarios
                      </Typography>
                      {p.type === "S" && (
                        <Typography variant="caption" color="success.main">
                          Recomendado
                        </Typography>
                      )}
                    </Box>
                  </ListItem>
                ))}

            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* Contenido principal del post */}
      <Grid size={{ xs: 12, md: 9 }}>
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
                {post.images.slice(0, 3).map((img, i) => (
                  <Box
                    key={i}
                    component="img"
                    src={img}
                    alt={`img-${i}`}
                    onClick={() => handleOpen(i)}
                    sx={{
                      width: 200,
                      height: 200,
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
                      width: 200,
                      height: 200,
                      bgcolor: "grey.500",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontWeight: "bold",
                      cursor: "pointer",
                      border: 1,
                      borderRadius: 1,
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
      </Grid>

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
    </Grid>
  );
}
