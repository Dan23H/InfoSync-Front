import { Box, Typography, Avatar, Card, CardContent, Grid, Snackbar, Button, DialogActions, DialogTitle, Dialog, InputLabel, Select, DialogContent, FormControl, MenuItem, Chip, IconButton, Menu, Divider } from "@mui/material";
import CommentsSection from "../comments/CommentsSection";
import type { Post } from "../../../../models";
import { useAuthor } from "../../../../hooks/useAuthor";
import { useAuth } from "../../../../context";
import { useState, useEffect, useContext, useRef } from "react";
import { createReport, deletePost } from "../../../../api";
import { useNavigate } from "react-router-dom";
import ModalPost from "./ModalPost";
import { updateDislike, updateLike, updatePost } from "../../../../api/post";
import LikeSelected from "../../../../assets/LikeSelected.svg";
import DislikeSelected from "../../../../assets/DislikeSelected.svg"; // Importar correctamente los íconos como componentes o rutas
import { useWilsonScore, getRecommendationLabel } from "../../../../hooks/useWilsonScore";
import SocketContext from "../../../../context/SocketContext";

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
  const [squareMounted, setSquareMounted] = useState(false);
  const [squareVisible, setSquareVisible] = useState(false);
  const hideTimerRef = useRef<number | null>(null);
  const [localLikeCount, setLocalLikeCount] = useState<number>(post.likeCount ?? 0);
  const [localDislikeCount, setLocalDislikeCount] = useState<number>(post.dislikeCount ?? 0);
  const { SocketDispatch, SocketState } = useContext(SocketContext);
  const open = Boolean(anchorEl);
  const urlActual = window.location.pathname;
  const urlVolver = urlActual.substring(0, urlActual.lastIndexOf('/'));
  const navigate = useNavigate();

  // WSS URL comes from global socket in context; no local socket creation here.

  // Sync local counters when post updates from props (e.g., via sockets)
  useEffect(() => {
    setLocalLikeCount(post.likeCount ?? 0);
    setLocalDislikeCount(post.dislikeCount ?? 0);
  }, [post.likeCount, post.dislikeCount]);

  // Use the global socket from SocketContext. Join the post room when the global socket is available.
  useEffect(() => {
    const socket = SocketState.socket;
    if (!socket) return;

    console.log(`Joining post room via global socket: post_${post._id}`);
    SocketDispatch({ type: 'join_post_room', payload: { postId: post._id } });

    return () => {
      // Optionally leave the post room when component unmounts
      try {
        socket.emit('leavePostRoom', post._id);
      } catch (err) {
        console.warn('Error leaving post room:', err);
      }
    };
  }, [post._id, SocketState.socket]);

  useEffect(() => {
    if (!SocketState.socket) return;

    console.log("Dispatching register_post_listeners action for postId:", post._id);
    SocketDispatch({
      type: 'register_post_listeners',
      // cast to any because context payload union type is broad; keep callbacks here
      payload: ({
        postId: post._id,
        onLikeUpdate: setLocalLikeCount,
        onDislikeUpdate: setLocalDislikeCount,
        onCommentAdded: (comment: any) => {
          console.log('Socket received comment_added for post', post._id, comment);
        },
        onCommentUpdated: (comment: any) => {
          console.log('Socket received comment_updated for post', post._id, comment);
        },
      } as any),
    });
  }, [SocketState.socket, post._id]);

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

  const score = useWilsonScore(localLikeCount, localDislikeCount);
  const totalVotes = (post.likeCount ?? 0) + (post.dislikeCount ?? 0);
  const recommendation = getRecommendationLabel(score, totalVotes);
  const recommendationLabel = recommendation.label;
  const recommendationColor = recommendation.color;

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
  };

  const handleLike = async () => {
    // Ensure global socket exists
    const socket = SocketState.socket;
    if (!socket) {
      console.warn('No global socket available for like');
      return;
    }

    const newLikeCount = localLikeCount + 1;
    setLocalLikeCount(newLikeCount);

    try {
      // Update backend (persistent) then notify via socket through the reducer
      await updateLike(post._id);
      console.log("Dispatching like_update via SocketDispatch for post:", post._id, newLikeCount);
      SocketDispatch({ type: 'like_update', payload: { postId: post._id, likeCount: newLikeCount } });
    } catch (error) {
      console.error("Error updating like count:", error);
      setLocalLikeCount((prev) => prev - 1); // Revert on error
    }
  };

  const handleDislike = async () => {
    const socket = SocketState.socket;
    if (!socket) {
      console.warn('No global socket available for dislike');
      return;
    }

    const newDislikeCount = localDislikeCount + 1;
    setLocalDislikeCount(newDislikeCount);

    try {
      await updateDislike(post._id);
      console.log("Dispatching dislike_update via SocketDispatch for post:", post._id, newDislikeCount);
      SocketDispatch({ type: 'dislike_update', payload: { postId: post._id, dislikeCount: newDislikeCount } });
    } catch (error) {
      console.error("Error updating dislike count:", error);
      setLocalDislikeCount((prev) => prev - 1);
    }
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

        {/* Botones de Like/Dislike, Clasificación y URL */}
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
              {squareMounted && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "100%",
                    transform: squareVisible ? "translate(0, -50%)" : "translate(5px, -50%)",
                    width: 20,
                    height: 20,
                    border: "2px solid green",
                    borderRadius: 1,
                    backgroundColor: "transparent",
                    transition: "transform 300ms cubic-bezier(.42,0,.58,1), opacity 300ms",
                    opacity: squareVisible ? 1 : 0,
                    pointerEvents: "none",
                    boxSizing: "border-box",
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'green',
                    fontSize: '1rem',
                    lineHeight: 1,
                  }}
                >
                  <span aria-hidden="true">✔</span>
                </Box>
              )}

              <Button
                variant="outlined"
                size="small"
                sx={{
                  color: "red",
                  borderColor: "red",
                  backgroundColor: "transparent",
                  ":hover": {
                    backgroundColor: "rgba(255, 0, 0, 0.1)",
                    borderColor: "darkred",
                  },
                }}
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);

                  // reset previous timer
                  if (hideTimerRef.current) {
                    window.clearTimeout(hideTimerRef.current);
                    hideTimerRef.current = null;
                  }
                  if (!squareMounted) {
                    setSquareMounted(true);
                    requestAnimationFrame(() => setSquareVisible(true));
                  } else {
                    setSquareVisible(true);
                  }

                  hideTimerRef.current = window.setTimeout(() => {
                    setSquareVisible(false);
                    window.setTimeout(() => setSquareMounted(false), 300);
                    hideTimerRef.current = null;
                  }, 5000);
                }}
              >
                Copiar URL
              </Button>
            </Box>
            
          </Box>
          {post.type === "S" && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="caption" sx={{ color: recommendationColor, userSelect: "none" }}>
                {recommendationLabel}
              </Typography>
              <IconButton onClick={(e) => { e.preventDefault(); handleLike(); }}>
                <Box component="img" src={LikeSelected} alt="Like" sx={{ width: 24, height: 24 }} />
              </IconButton>
              <Typography variant="body2">{localLikeCount}</Typography>
              <IconButton onClick={(e) => { e.preventDefault(); handleDislike(); }}>
                <Box component="img" src={DislikeSelected} alt="Dislike" sx={{ width: 24, height: 24 }} />
              </IconButton>
              <Typography variant="body2">{localDislikeCount}</Typography>
            </Box>
          )}
        </Box>

      </CardContent>
      <Divider sx={{ my: 2 }} />
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
