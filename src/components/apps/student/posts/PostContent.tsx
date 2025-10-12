import { Box, Typography, Avatar, Card, CardContent, Grid, Snackbar, Button, DialogActions, DialogTitle, Dialog, InputLabel, Select, DialogContent, FormControl, MenuItem, Chip, IconButton, Menu, Divider } from "@mui/material";
import CommentsSection from "../comments/CommentsSection";
import type { Post } from "../../../../models";
import { useAuthor } from "../../../../hooks/useAuthor";
import { useAuth } from "../../../../context";
import { useState } from "react";
import { createReport, deletePost } from "../../../../api";
import { useNavigate } from "react-router-dom";
import ModalPost from "./ModalPost";
import { updatePost } from "../../../../api/post";

interface PostContentProps {
  post: Post;
  onImageClick: (index: number) => void;
}

export default function PostContent({ post, onImageClick }: PostContentProps) {
  const { user: author, loading } = useAuthor(post.userId || null);
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const open = Boolean(anchorEl);
  const urlActual = window.location.pathname;
  const urlVolver = urlActual.substring(0, urlActual.lastIndexOf('/'));
  const navigate = useNavigate();

  const REPORT_REASONS = [
    "Inappropriate",
    "Harassment",
    "Offensive",
    "Spam",
    "Misleading",
    "Copyright",
    "Impersonation",
    "Privacy",
  ];

  const canEditOrDelete =
    post.userId === user._id &&
    Date.now() - new Date(post.createdAt).getTime() < 2 * 60 * 60 * 1000;

  const handleReportSubmit = async () => {
    await createReport({
      userId: user._id,
      targetType: "post",
      targetId: post._id,
      reason: reportReason,
    });
    setReportDialogOpen(false);
    setReportReason("");
    setSnackbarOpen(true);
  };

  const handleDeletePost = async () => {
    await deletePost(post._id, user._id);
    setDeleteDialogOpen(false);
    navigate(urlVolver)
    // Puedes redirigir o actualizar la vista aquí si lo necesitas
  };

  return (
    <Card sx={{ backgroundColor: "#D9D9D9", p: 2 }}>
      <CardContent>
        {/* Header */}
        <Box sx={{
          display: "flex",
          alignItems: "center",
          mb: 2,
          justifyContent: "space-between"
        }}>
          {/* Izquierda: avatar, usuario, fecha */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar sx={{ bgcolor: "brown" }} />
            <Typography variant="body2" fontWeight="bold">
              {author ? author.userName : loading ? "Cargando..." : "Desconocido"}
            </Typography>
            <Typography variant="body2" sx={{ ml: 1 }}>
              {new Date(post.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
          {/* Derecha: tipo y menú */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Chip
              label={post.type === "Q" ? "Pregunta" : "Sugerencia"}
              size="small"
              sx={{ bgcolor: post.type === "Q" ? "#787777" : "#006387", color: "#fff" }}
            />
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setAnchorEl(e.currentTarget);
              }}
            >
              {"···"}
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={() => setAnchorEl(null)}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              <MenuItem
                onClick={() => {
                  setReportDialogOpen(true);
                  setAnchorEl(null);
                }}
              >
                Reportar
              </MenuItem>
              {canEditOrDelete && (
                <MenuItem
                  onClick={() => {
                    setEditModalOpen(true);
                    setAnchorEl(null);
                  }}
                >
                  Editar
                </MenuItem>
              )}
              {canEditOrDelete && (
                <MenuItem
                  onClick={() => {
                    setDeleteDialogOpen(true);
                    setAnchorEl(null);
                  }}
                >
                  Borrar
                </MenuItem>
              )}
            </Menu>
          </Box>
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
        onCommentCountChange={() => { }}
      />

      {/* Menú de opciones */}
      <Dialog open={reportDialogOpen} onClose={() => setReportDialogOpen(false)}>
        <DialogTitle>Reportar publicación</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel id="report-reason-label">Motivo</InputLabel>
            <Select
              labelId="report-reason-label"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
            >
              {REPORT_REASONS.map((reason) => (
                <MenuItem key={reason} value={reason}>
                  {reason}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReportDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleReportSubmit} disabled={!reportReason}>
            Enviar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para borrar */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle color="error" textAlign={"center"} >
          ¿Estás seguro de que deseas borrar esta publicación?
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Typography variant="body1" textAlign={"center"}>
            El post se eliminará permanentemente y no podrá recuperarse de ninguna forma.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Volver</Button>
          <Button color="error" onClick={handleDeletePost}>
            Borrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para editar post */}
      <ModalPost
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSubmit={async (data) => {
          await updatePost(post._id, data);
          setEditModalOpen(false);
          window.location.reload(); 
        }}
        initialData={post}
        courses={[{ name: post.course, slug: "" }]}
      />

      {/* Snackbar de confirmación */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        message="Reporte enviado correctamente"
        onClose={() => setSnackbarOpen(false)}
      />
    </Card >
  );
}
