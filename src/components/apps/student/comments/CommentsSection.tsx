import { useEffect, useState } from "react";
import { Box, Typography, Avatar, TextField, Button } from "@mui/material";
import { getComments, createComment, createSubComment } from "../../../../api";
import type { Comment } from "../../../../models";
import CommentItem from "./CommentItem";

interface CommentsProps {
  postId: string;
  userId: string;
  likeCount?: number;
  dislikeCount?: number;
  onCommentCountChange?: (count: number) => void;
}

export default function CommentsSection({ postId, userId, likeCount = 0, dislikeCount = 0, onCommentCountChange }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  // Variables para contadores
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const data = await getComments(postId);
        setComments(data);
          // Actualiza el contador al cargar comentarios
          const total = data.reduce(
            (acc, c) => acc + 1 + (c.subComments?.length || 0),
            0
          );
          setCommentCount(total);
          onCommentCountChange?.(total);
          // Aquí podrías obtener los valores de likeCount y dislikeCount si los recibes del post
          // setLikeCount(post.likeCount ?? 0);
          // setDislikeCount(post.dislikeCount ?? 0);
      } catch (err) {
        console.error("Error cargando comentarios:", err);
      }
    })();
  }, [postId]);

  const updateCommentCount = (commentsList: Comment[]) => {
    const total = commentsList.reduce(
      (acc, c) => acc + 1 + (c.subComments?.length || 0),
      0
    );
      setCommentCount(total);
      onCommentCountChange?.(total);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setLoading(true);
    try {
      const comment = await createComment({ userId, postId, commentary: newComment });
      setComments((prev) => {
        const updated = [comment, ...prev];
        updateCommentCount(updated);
        return updated;
      });
      setNewComment("");
    } catch (err) {
      console.error("Error creando comentario:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubComment = async (commentId: string, text: string) => {
    if (!text.trim()) return;
    try {
      const updatedComment = await createSubComment(commentId, { userId, commentary: text });

      setComments((prev) => {
        const updated = prev.map((c) => (c._id === commentId ? updatedComment : c));
        updateCommentCount(updated);
        return updated;
      });
    } catch (err) {
      console.error("Error creando subcomentario:", err);
    }
  };

  return (
    <Box mt={3}>
      <Typography variant="h6" gutterBottom>
        Comentarios
      </Typography>

        {/* Debug/Visualización de contadores */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2">Comentarios: {commentCount}</Typography>
          <Typography variant="body2">Likes: {likeCount}</Typography>
          <Typography variant="body2">Dislikes: {dislikeCount}</Typography>
        </Box>

      {/* Nuevo comentario */}
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <Avatar>{userId[0]}</Avatar>
        <TextField
          fullWidth
          size="small"
          placeholder="Escribe un comentario..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && newComment.trim()) {
              // Para evitar que se envíe el subcomentario y el comentario al mismo tiempo
              e.preventDefault();
              e.stopPropagation();
              handleAddComment();
            }
          }}
        />

        {/* Usar imagen SVG en lugar de botón */}
        <Button variant="contained" color="error" onClick={handleAddComment} disabled={loading}>
          Comentar{/* <img src="/path/to/comment-icon.svg" alt="Comentar" /> */}
        </Button>
      </Box>

      {/* Lista de comentarios */}
      {comments.map((c) => (
        <CommentItem
          key={c._id}
          comment={c}
          onAddSubComment={handleAddSubComment}
        />
      ))}
    </Box>
  );
}
