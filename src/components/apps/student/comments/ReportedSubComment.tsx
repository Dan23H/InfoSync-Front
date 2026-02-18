import "../../../../styles/student-comments.css";
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
    <Box className="reported-subcomment">
      <Box style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <Avatar className="avatar">
          {subAuthor ? subAuthor.userName[0].toUpperCase() : subComment.userId[0]}
        </Avatar>
        <Typography variant="subtitle2" className="author">
          {subAuthor ? subAuthor.userName : loading ? "Cargando..." : "Desconocido"}
        </Typography>
      </Box>
      <Typography variant="body2" className="commentary">
        {subComment.commentary}
      </Typography>
    </Box>
  );
}