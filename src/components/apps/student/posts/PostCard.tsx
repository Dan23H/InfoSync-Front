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
import { useWilsonScore, getRecommendationLabel } from "../../../../hooks/useWilsonScore";
import CopyUrlButton from "./CopyUrlButton";

interface PostCardProps {
  post: Post;
  currentUserId?: string;
}

export default function PostCard({ post, currentUserId }: PostCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const { user: author, loading } = useAuthor(post.userId);

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
  const score = useWilsonScore(post.likeCount ?? 0, post.dislikeCount ?? 0);
  const totalVotes = (post.likeCount ?? 0) + (post.dislikeCount ?? 0);
  const recommendation = getRecommendationLabel(score, totalVotes);
  const recommendationLabel = recommendation.label;
  const recommendationColor = recommendation.color;

  const open = Boolean(anchorEl);

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

  const handleEditPost = async (data: any) => {
    try {
      await updatePost(post._id, data);
      setEditModalOpen(false);
      window.location.reload();
    } catch (err) {
      console.error("Error al editar el post", err);
    }
  };

  const URL = `${window.location.origin}/student/${post.pensumId}/${slugify(post.course)}/${post._id}`;

  return (
    <>
      <Card className="post-card">
        <CardContent
          component={Link}
          to={`/student/${post.pensumId}/${slugify(post.course)}/${post._id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          {/* Encabezado */}
          <Box className="post-header">
            <Box style={{ display: "flex", alignItems: "center", gap: 4, lineHeight: 1.5 }}>
              <Avatar className="avatar" />
              <Typography variant="body2" className="author">
                {author ? author.userName : loading ? "Cargando..." : "Desconocido"}
              </Typography>
              <Typography variant="body2">
                {new Date(post.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
            {/* Menú de opciones */}
            <Box style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Chip
                label={post.type === "Q" ? "Pregunta" : "Sugerencia"}
                size="small"
                className={post.type === "Q" ? "chip-question" : "chip-suggestion"}
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
          <Typography variant="h6" className="post-title">{post.title}</Typography>
          <Typography variant="body2" className="post-description">
            {post.description}
          </Typography>
        </CardContent>

        {/* Footer */}
        <CardActions className="post-footer">
          <Box style={{ display: "flex", gap: 8 }}>
            <Typography variant="body2" style={{ userSelect: "none", alignSelf: "center", marginLeft: 4 }}>
              {commentsCount} – Comentarios
            </Typography>
            <CopyUrlButton to={URL} />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {post.type === "S" && (
              <Typography variant="body2" sx={{ userSelect: "none", color: recommendationColor }}>
                {recommendationLabel}
              </Typography>
            )}
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
        onSubmit={handleEditPost}
        initialData={post}
        courses={[{ name: post.course, slug: "" }]}
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
