import { useContext, useEffect, useState } from "react";
import { Box, Typography, Avatar, TextField, Button } from "@mui/material";
import { getComments, createComment, createSubComment } from "../../../../api";
import type { Comment } from "../../../../models";
import CommentItem from "./CommentItem";
import { useAuthor } from "../../../../hooks/useAuthor";
import SocketContext from "../../../../context/SocketContext";

interface CommentsProps {
  postId: string;
  userId: string;
  likeCount?: number;
  dislikeCount?: number;
  onCommentCountChange?: (count: number) => void;
}

export default function CommentsSection({ postId, userId, onCommentCountChange }: CommentsProps) {
  const { SocketState } = useContext(SocketContext);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const { user: author, loading: _ } = useAuthor(userId || null);
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const data = await getComments(postId);
        setComments(data);
        const total = data.reduce(
          (acc, c) => acc + 1 + (c.subComments?.length || 0),
          0
        );
        setCommentCount(total);
        onCommentCountChange?.(total);
      } catch (err) {
        console.error("Error cargando comentarios:", err);
      }
    })();
    console.log("Updated comment count:", commentCount);
  }, [postId, SocketState.socket]);

  useEffect(() => {
    if (!SocketState.socket) return;

    const handleCommentAdded = (comment: Comment) => {
      console.log("New comment added:", comment);
      setComments((prev) => {
        const updated = [comment, ...prev];
        updateCommentCount(updated);
        return updated;
      });
    };

    const handleCommentUpdated = (updatedComment: Comment) => {
      console.log("Comment updated:", updatedComment);
      setComments((prev) => {
        const updated = prev.map((c) => (c._id === updatedComment._id ? updatedComment : c));
        updateCommentCount(updated);
        return updated;
      });
    };

    SocketState.socket.on("comment_added", handleCommentAdded);
    SocketState.socket.on("comment_updated", handleCommentUpdated);

    return () => {
      if (SocketState.socket) {
        SocketState.socket.off("comment_added", handleCommentAdded);
        SocketState.socket.off("comment_updated", handleCommentUpdated);
      }
    };
  }, [SocketState.socket]);

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

      {/* Nuevo comentario */}
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <Avatar>{author ? author.userName[0] : loading ? "..." : "?"}</Avatar>
        <TextField
          fullWidth
          size="small"
          placeholder="Escribe un comentario..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && newComment.trim()) {
              e.preventDefault();
              e.stopPropagation();
              handleAddComment();
            }
          }}
        />
        <Button variant="contained" color="error" onClick={handleAddComment} disabled={loading}>
          Comentar
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
