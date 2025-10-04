import { useState } from "react";
import { Box, Typography, Avatar, TextField, Divider, IconButton, Button } from "@mui/material";
import type { Comment } from "../../../../models";
import { useAuthor } from "../../../../hooks/useAuthor";
import SubCommentItem from "./SubcommentItem";

interface CommentItemProps {
    comment: Comment;
    onAddSubComment: (commentId: string, text: string) => void;
}

export default function CommentItem({ comment, onAddSubComment }: CommentItemProps) {
    const { user: author, loading } = useAuthor(comment.userId || null);
    const [replyText, setReplyText] = useState("");
    const [showSubcomments, setShowSubcomments] = useState(false);
    const [showReplyInput, setShowReplyInput] = useState(false);

    return (
        <Box sx={{ mb: 2, pl: 1 }}>
            {/* Encabezado del comentario */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Avatar>{author ? author.userName[0].toUpperCase() : loading ? "..." : "?"}</Avatar>
                <Typography variant="subtitle2">
                    {author ? author.userName : loading ? "Cargando..." : "Desconocido"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    {new Date(comment.createdAt).toLocaleString()}
                </Typography>
                <IconButton size="small" sx={{ ml: "auto" }}>Report</IconButton>
            </Box>

            {/* Texto del comentario */}
            <Typography variant="body2" sx={{ ml: 5 }}>
                {comment.commentary}
            </Typography>

            {/* Botón para mostrar subcomentarios si existen */}
            {comment.subComments && comment.subComments.length > 0 && (
                <Button
                    size="small"
                    sx={{ ml: 6, mt: 1, textTransform: "none", color: "darkblue" }}
                    onClick={() => setShowSubcomments((prev) => !prev)}
                >
                    {showSubcomments ? "Ocultar respuestas" : `Ver respuestas (${comment.subComments.length})`}
                </Button>
            )}

            {/* Subcomentarios desplegables */}
            {showSubcomments && (
                <Box sx={{ ml: 6, mt: 1 }}>
                    {comment.subComments?.map((sc) => (
                        <SubCommentItem key={sc._id} subComment={sc} />
                    ))}
                </Box>
            )}

            {/* Botón para mostrar input de respuesta */}
            <Button
                size="small"
                sx={{ ml: 6, mt: 1, textTransform: "none", color: "darkred" }}
                onClick={() => setShowReplyInput((prev) => !prev)}
            >
                {showReplyInput ? "Cancelar" : "Responder"}
            </Button>

            {/* Input para nuevo subcomentario */}
            {showReplyInput && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1, ml: 6 }}>
                    <TextField
                        size="small"
                        fullWidth
                        placeholder="Responder..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && replyText.trim()) {
                                e.preventDefault();
                                e.stopPropagation();
                                onAddSubComment(comment._id, replyText);
                                setReplyText("");
                                setShowReplyInput(false);
                            }
                        }}
                    />
                    <Button
                        color="primary"
                        size="small"
                        disabled={!replyText.trim()}
                        onClick={() => {
                            onAddSubComment(comment._id, replyText);
                            setReplyText("");
                            setShowReplyInput(false);
                        }}
                    >
                        Enviar
                    </Button>
                </Box>
            )}

            <Divider sx={{ mt: 1 }} />
        </Box>
    );
}
