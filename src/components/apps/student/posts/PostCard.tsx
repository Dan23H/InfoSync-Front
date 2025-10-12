import { Box, Typography, IconButton, Chip, Menu, MenuItem, Card, CardContent, CardActions, Avatar, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, InputLabel, Select, Divider } from "@mui/material";
import { useState } from "react";
import type { Post } from "../../../../models";
import { Link } from "react-router-dom";
import { slugify } from "../../../../utils/slugify";
import { AddBookmarkSVG, BookmarkSVG, DislikeSelected, DislikeUnselected, LikeSelected, LikeUnselected } from "../../../../assets";
import { useCommentsCount } from "../../../../hooks/useCounter";
import { createReport, deletePost, updatePost } from "../../../../api";
import { useAuthor } from "../../../../hooks/useAuthor";
import ModalPost from "./ModalPost";

interface PostCardProps {
  post: Post;
  currentUserId?: string;
}

export default function PostCard({ post, currentUserId }: PostCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

  const { user: author, loading } = useAuthor(post.userId);

  // Estado del diálogo de reporte
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);

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

  const commentsCount = useCommentsCount(post._id);

  const open = Boolean(anchorEl);

  // validación editar/borrar: mismo user y < 2 horas
  const canEditOrDelete =
    post.userId === currentUserId &&
    Date.now() - new Date(post.createdAt).getTime() < 2 * 60 * 60 * 1000;

  const handleReportSubmit = async () => {
    try {
      await createReport({
        userId: currentUserId || "",
        targetType: "post",
        targetId: post._id,
        reason: reportReason,
      });
      setReportDialogOpen(false);
      setReportReason("");
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Error al enviar el reporte", err);
    }
  };

  const handleDeletePost = async () => {
    try {
      await deletePost(post._id, currentUserId || "");
      setDeleteDialogOpen(false);
    } catch (err) {
      console.error("Error al borrar el post", err);
    }
  };

  // Cálculo del ranking para sugerencias
  const totalVotes = (post.likeCount ?? 0) + (post.dislikeCount ?? 0);
  const rankingNumber = (post.likeCount ?? 0) / (totalVotes || 1);

  return (
    <>
      <Card sx={{ mb: 2, backgroundColor: "#D9D9D9", border: "1px solid #ccc", borderRadius: 2, boxShadow: 1 }}>
        <CardContent
          component={Link}
          to={`/student/${post.pensumId}/${slugify(post.course)}/${post._id}`}
          sx={{ textDecoration: "none", color: "inherit" }}
        >
          {/* Encabezado */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1, ml: 2, mr: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar sx={{ width: 24, height: 24, bgcolor: "brown" }} />
              <Typography variant="body2" fontWeight="bold">
                {author ? author.userName : loading ? "Cargando..." : "Desconocido"}
              </Typography>
              <Typography variant="body2">
                {new Date(post.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
            {/* Menú de opciones */}
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
                {canEditOrDelete && (<MenuItem
                  onClick={() => {
                    setDeleteDialogOpen(true);
                    setAnchorEl(null);
                  }}
                >
                  Borrar
                </MenuItem>)}
              </Menu>
            </Box>
          </Box>

          {/* Contenido del post */}
          <Typography variant="h6" sx={{ ml: 2, mr: 2, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" }}>{post.title}</Typography>
          <Typography variant="body2" sx={{ mt: 1, ml: 2, mr: 2, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" }}>
            {post.description}
          </Typography>
        </CardContent>

        {/* Footer */}
        <CardActions sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Typography variant="body2" sx={{ userSelect: "none" }}>
              {commentsCount} – Comentarios
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
              {copied && (
                <Typography
                  variant="caption"
                  sx={{
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)",
                    px: 1,
                    py: 0.2,
                    borderRadius: 1,
                    color: "green",
                    fontWeight: 500,
                    fontSize: "0.7em",
                    userSelect: "none",
                    animation: "flyUp 0.5s cubic-bezier(.42,0,.58,1) forwards",
                    "@keyframes flyUp": {
                      from: { opacity: 0, top: 0 },
                      to: { opacity: 1, top: -18 },
                    }
                  }}
                >
                  ¡Copiado!
                </Typography>
              )}
              <Typography
                variant="body2"
                sx={{ cursor: "pointer", ":hover": { color: "darkblue" }, userSelect: "none" }}
                onClick={() => {
                  const url = `${window.location.origin}/student/${post.pensumId}/${slugify(post.course)}/${post._id}`;
                  navigator.clipboard.writeText(url);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 4000);
                }}
              >
                Compartir
              </Typography>
            </Box>
            {post.type === "S" && (
              <Typography variant="body2" sx={{ userSelect: "none", ...rankingNumber > 0 ? { color: "green" } : rankingNumber < 0 ? { color: "red" } : {} }}>
                {totalVotes > 25 ? (rankingNumber > 0.66 ? "Muy Recomendado" : rankingNumber > 0.33 ? "Recomendado" : rankingNumber > 0 ? "Poco Recomendado" : "No Recomendado") : ""}
              </Typography>
            )}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Botones Like/Dislike para sugerencias */}
            {post.type === "S" && (
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton
                  onClick={() => {
                    setLiked(!liked);
                    if (disliked) setDisliked(false);
                  }}
                >
                  {liked ? <img src={LikeSelected} alt="like" width={22} height={22} /> : <img src={LikeUnselected} alt="like" width={22} height={22} />}
                </IconButton>
                <IconButton
                  onClick={() => {
                    setDisliked(!disliked);
                    if (liked) setLiked(false);
                  }}
                >
                  {disliked ? <img src={DislikeSelected} alt="dislike" width={22} height={22} /> : <img src={DislikeUnselected} alt="dislike" width={22} height={22} />}
                </IconButton>
              </Box>
            )}
            <IconButton
              onClick={() => {
                setBookmarked(!bookmarked);
              }}
            >
              {bookmarked ? <img src={BookmarkSVG} alt="bookmark" width={20} height={20} /> : <img src={AddBookmarkSVG} alt="bookmark" width={20} height={20} style={{ filter: "grayscale(100%)" }} />}
            </IconButton>
          </Box>
        </CardActions>
      </Card>

      {/* Diálogo para reportar */}
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

      <ModalPost
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSubmit={async (data) => {
          await updatePost(post._id, data);
          setEditModalOpen(false);
          window.location.reload();
        }}
        initialData={post}
        courses={[{ name: post.course, slug: "" }]} // O tu lista de cursos
      />

      {/* Feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        message="Reporte enviado correctamente"
        onClose={() => setSnackbarOpen(false)}
      />
    </>
  );
}
