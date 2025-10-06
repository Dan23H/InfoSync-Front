import { Box, Typography, Avatar } from "@mui/material";
import type { SubComment } from "../../../../models";
import { useAuthor } from "../../../../hooks/useAuthor";

interface ReportedSubCommentProps {
  subComment: SubComment;
}

export default function ReportedSubComment({ subComment }: ReportedSubCommentProps) {
  const { user: subAuthor, loading } = useAuthor(subComment.userId || null);
  console.log("ReportedSubComment - subComment:", subComment);

  return (
    <Box sx={{ mb: 2, pl: 1 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Avatar sx={{ width: 24, height: 24 }}>
          {subAuthor ? subAuthor.userName[0].toUpperCase() : subComment.userId[0]}
        </Avatar>
        <Typography variant="subtitle2">
          {subAuthor ? subAuthor.userName : loading ? "Cargando..." : "Desconocido"}
        </Typography>
      </Box>
      <Typography variant="body2" sx={{ ml: 4 }}>
        {subComment.commentary}
      </Typography>
    </Box>
  );
}