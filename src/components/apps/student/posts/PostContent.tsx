import { Box, Typography, Avatar, Card, CardContent, Grid, Snackbar, Button, DialogActions, DialogTitle, Dialog, InputLabel, Select, DialogContent, FormControl, MenuItem, Chip, IconButton, Menu, Divider } from "@mui/material";
import CommentsSection from "../comments/CommentsSection";
import type { Post } from "../../../../models";
import { useAuthor } from "../../../../hooks/useAuthor";
import { useAuth } from "../../../../context";
import { useState, useEffect, useContext } from "react";
import { createReport, deletePost } from "../../../../api";
import { useNavigate } from "react-router-dom";
import ModalPost from "./ModalPost";
import { updateDislike, updateLike, updatePost } from "../../../../api/post";
import LikeSelected from "../../../../assets/LikeSelected.svg";
import DislikeSelected from "../../../../assets/DislikeSelected.svg"; // Importar correctamente los íconos como componentes o rutas
import { useWilsonScore, getRecommendationLabel } from "../../../../hooks/useWilsonScore";
import { io, Socket } from "socket.io-client";
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
  const [localLikeCount, setLocalLikeCount] = useState<number>(post.likeCount ?? 0);
  const [localDislikeCount, setLocalDislikeCount] = useState<number>(post.dislikeCount ?? 0);
  const [socket, setSocket] = useState<Socket | null>(null);
  const { SocketDispatch } = useContext(SocketContext);
  const open = Boolean(anchorEl);
  const urlActual = window.location.pathname;
  const urlVolver = urlActual.substring(0, urlActual.lastIndexOf('/'));
  const navigate = useNavigate();

  // Sync local counters when post updates from props (e.g., via sockets)
  useEffect(() => {
    setLocalLikeCount(post.likeCount ?? 0);
    setLocalDislikeCount(post.dislikeCount ?? 0);
  }, [post.likeCount, post.dislikeCount]);

  useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      console.error("Token is missing. Please log in to establish a WebSocket connection.");
      return;
    }

    const newSocket = io("http://localhost:3000", {
      query: { token },
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    setSocket(newSocket);

    // Join the post room
    newSocket.emit("joinPostRoom", post._id);

    newSocket.on("connect", () => {
      console.log("WebSocket connected.");

      // Re-register listeners after reconnection
      newSocket.on("like_update", ({ postId, likeCount }) => {
        console.log("Received like_update event for postId:", postId, "with likeCount:", likeCount);
        if (postId === post._id) {
          setLocalLikeCount(likeCount);
          console.log("Updated local like count to:", likeCount);
        }
      });

      newSocket.on("dislike_update", ({ postId, dislikeCount }) => {
        console.log("Received dislike_update event for postId:", postId, "with dislikeCount:", dislikeCount);
        if (postId === post._id) {
          setLocalDislikeCount(dislikeCount);
          console.log("Updated local dislike count to:", dislikeCount);
        }
      });
    });

    newSocket.on("disconnect", () => {
      console.warn("WebSocket disconnected.");
    });

    return () => {
      // Leave the post room and clean up listeners
      newSocket.off("like_update");
      newSocket.off("dislike_update");
      newSocket.emit("leavePostRoom", post._id);
      newSocket.close();
    };
  }, [post._id]);

  useEffect(() => {
    if (!socket) return;

    console.log("Dispatching register_post_listeners action for postId:", post._id);
    SocketDispatch({
      type: 'register_post_listeners',
      payload: {
        postId: post._id,
        onLikeUpdate: setLocalLikeCount,
        onDislikeUpdate: setLocalDislikeCount,
      },
    });
  }, [socket, post._id]);

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
    if (!socket) return;

    const newLikeCount = localLikeCount + 1;
    setLocalLikeCount(newLikeCount);

    try {
      // Emit like event to the server
      await updateLike(post._id);
      console.log("Attempting to emit like_update event for post:", post._id);
      socket.emit("like_update", { postId: post._id, likeCount: newLikeCount }, () => {
        console.log(`Server acknowledged like event for post: ${post._id} with likeCount: ${newLikeCount}`);
      });
    } catch (error) {
      console.error("Error updating like count:", error);
      setLocalLikeCount((prev) => prev - 1); // Revert on error
    }
  };

  const handleDislike = async () => {
    if (!socket) return;
    const newDislikeCount = localDislikeCount + 1;
    setLocalDislikeCount(newDislikeCount);

    try {
      // Emit dislike event to the server
      await updateDislike(post._id);
      console.log("Attempting to emit dislike_update event for post:", post._id);
      console.log("Socket connected state:", socket?.connected);
      socket.emit("dislike_update", { postId: post._id, dislikeCount: newDislikeCount }, () => {
        console.log(`Server acknowledged dislike event for post: ${post._id} with dislikeCount: ${newDislikeCount}`);
      });
    } catch (error) {
      console.error("Error updating dislike count:", error);
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
              onClick={() => navigator.clipboard.writeText(window.location.href)}
            >
              Copiar URL
            </Button>
            {post.type === "S" && (
              <Typography variant="caption" sx={{ color: recommendationColor, userSelect: "none" }}>
                {recommendationLabel}
              </Typography>
            )}
          </Box>
          {post.type === "S" && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
