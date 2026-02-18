import "../../../../styles/student-comments.css";
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
        // ordenar por createdAt descendente (más nuevo primero)
        const sorted = Array.isArray(data)
          ? data.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          : data;
        setComments(sorted as Comment[]);
        const total = (sorted as Comment[]).reduce(
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

    // Attach direct socket listeners for comment events. We filter by postId inside the handlers
    const socket = SocketState.socket;

    const handleSocketCommentAdded = ({ postId: eventPostId, comment }: { postId: string; comment: Comment }) => {
      if (eventPostId !== postId) return;
      console.log("Socket: comment_added received for post", eventPostId, comment);
      setComments((prev) => {
        const merged = [comment, ...prev];
        const unique = uniqCommentsById(merged);
        updateCommentCount(unique);
        return unique;
      });
    };

    const handleSocketCommentUpdated = ({ postId: eventPostId, comment: updatedComment }: { postId: string; comment: Comment }) => {
      if (eventPostId !== postId) return;
      console.log("Socket: comment_updated received for post", eventPostId, updatedComment);
      setComments((prev) => {
        const exists = prev.some((c) => c._id === updatedComment._id);
        let updated: Comment[];
        if (exists) {
          updated = prev.map((c) => (c._id === updatedComment._id ? updatedComment : c));
        } else {
          // If we didn't have the comment locally (rare), add it at the top
          updated = [updatedComment, ...prev];
        }
        const unique = uniqCommentsById(updated);
        updateCommentCount(unique);
        return unique;
      });
    };

    socket.on("comment_added", handleSocketCommentAdded);
    socket.on("comment_updated", handleSocketCommentUpdated);

    return () => {
      socket.off("comment_added", handleSocketCommentAdded);
      socket.off("comment_updated", handleSocketCommentUpdated);
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

  const uniqCommentsById = (list: Comment[]) => {
    const seen = new Set<string>();
    const out: Comment[] = [];
    for (const c of list) {
      if (!c || !c._id) continue;
      if (seen.has(c._id)) continue;
      seen.add(c._id);
      out.push(c);
    }
    return out;
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setLoading(true);
    try {
      const payload = {
        userId: String(userId),
        postId: String(postId).trim(),
        commentary: newComment.trim(),
      };

      const comment = await createComment(payload);
      setComments((prev) => {
        const merged = [comment, ...prev];
        const unique = uniqCommentsById(merged);
        updateCommentCount(unique);
        return unique;
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
        const unique = uniqCommentsById(updated);
        updateCommentCount(unique);
        return unique;
      });
    } catch (err) {
      console.error("Error creando subcomentario:", err);
    }
  };

  return (
    <Box className="comments-section">
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
