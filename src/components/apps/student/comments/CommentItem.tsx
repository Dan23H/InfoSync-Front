import { useState } from "react";
import { Box, Typography, Avatar, TextField, Divider } from "@mui/material";
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

    return (
        <Box sx={{ mb: 2, pl: 1 }}>
            {/* Encabezado del comentario */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Avatar>{author ? author.userName[0] : comment.userId[0]}</Avatar>
                <Typography variant="subtitle2">
                    {author ? author.userName : loading ? "Cargando..." : "Desconocido"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    {new Date(comment.createdAt).toLocaleString()}
                </Typography>
            </Box>

            {/* Texto del comentario */}
            <Typography variant="body2" sx={{ ml: 5 }}>
                {comment.commentary}
            </Typography>

            {/* Subcomentarios */}
            <Box sx={{ ml: 6, mt: 1 }}>
                {comment.subComments?.map((sc) => (
                    <SubCommentItem key={sc._id} subComment={sc} />
                ))}

                {/* Input para nuevo subcomentario */}
                <TextField
                    size="small"
                    fullWidth
                    placeholder="Responder..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && replyText.trim()) {
                            // Para evitar que se envíe el subcomentario y el comentario al mismo tiempo
                            e.preventDefault();
                            e.stopPropagation();
                            onAddSubComment(comment._id, replyText);
                            setReplyText("");
                        }
                    }}
                />
            </Box>


            <Divider sx={{ mt: 1 }} />
        </Box>
    );
}
