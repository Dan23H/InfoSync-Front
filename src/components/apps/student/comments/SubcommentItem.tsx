    import { Box, Typography, Avatar } from "@mui/material";
import type { SubComment } from "../../../../models";
import { useAuthor } from "../../../../hooks/useAuthor";

interface SubcommentItemProps {
  subComment: SubComment;
}

export default function SubCommentItem({ subComment }: SubcommentItemProps) {
  const { user: subAuthor, loading } = useAuthor(subComment.userId || null);

  return (
    <Box sx={{ mb: 1 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Avatar sx={{ width: 24, height: 24 }}>
          {subAuthor ? subAuthor.userName[0] : subComment.userId[0]}
        </Avatar>
        <Typography variant="subtitle2">
          {subAuthor ? subAuthor.userName : loading ? "Cargando..." : "Desconocido"}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {new Date(subComment.createdAt).toLocaleString()}
        </Typography>
      </Box>
      <Typography variant="body2" sx={{ ml: 4 }}>
        {subComment.commentary}
      </Typography>
    </Box>
  );
}
