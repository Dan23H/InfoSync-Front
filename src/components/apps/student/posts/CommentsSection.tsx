import { useEffect, useState } from "react";
import { Box, Typography, Avatar, TextField, Button, Divider } from "@mui/material";
import { getComments, createComment, createSubComment } from "../../../../api/pensum";
import type { Comment } from "../../../../models";

interface CommentsProps {
  postId: string;
  userId: string; // en el futuro lo sacas de auth
}

export default function CommentsSection({ postId, userId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getComments(postId);
        setComments(data);
      } catch (err) {
        console.error("Error cargando comentarios:", err);
      }
    })();
  }, [postId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setLoading(true);
    try {
      const comment = await createComment({ userId, postId, commentary: newComment });
      setComments((prev) => [comment, ...prev]);
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
      const updated = await createSubComment(commentId, { userId, commentary: text });
      // actualiza el comentario en la lista
      setComments((prev) =>
        prev.map((c) => (c._id === updated._id ? updated : c))
      );
    } catch (err) {
      console.error("Error creando subcomentario:", err);
    }
  };

  return (
    <Box mt={3}>
      <Typography variant="h6" gutterBottom>
        Comentarios
      </Typography>

      {/* Caja para nuevo comentario */}
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <Avatar>{userId[0]}</Avatar>
        <TextField
          fullWidth
          size="small"
          placeholder="Escribe un comentario..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button variant="contained" onClick={handleAddComment} disabled={loading}>
          Publicar
        </Button>
      </Box>

      {/* Lista de comentarios */}
      {comments.map((c) => (
        <Box key={c._id} sx={{ mb: 2, pl: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar>{c.userId[0]}</Avatar>
            <Typography variant="subtitle2">{c.userId}</Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(c.createdAt).toLocaleString()}
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ ml: 5 }}>
            {c.commentary}
          </Typography>

          {/* Subcomentarios */}
          <Box sx={{ ml: 6, mt: 1 }}>
            {c.subcomments?.map((sc) => (
              <Box key={sc._id} sx={{ mb: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Avatar sx={{ width: 24, height: 24 }}>{sc.userId[0]}</Avatar>
                  <Typography variant="subtitle2">{sc.userId}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(sc.createdAt).toLocaleString()}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ ml: 4 }}>
                  {sc.commentary}
                </Typography>
              </Box>
            ))}

            {/* Input para subcomentario */}
            <TextField
              size="small"
              fullWidth
              placeholder="Responder..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddSubComment(c._id, (e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = "";
                }
              }}
            />
          </Box>

          <Divider sx={{ mt: 1 }} />
        </Box>
      ))}
    </Box>
  );
}
