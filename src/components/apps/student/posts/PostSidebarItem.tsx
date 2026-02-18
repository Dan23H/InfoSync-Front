import { Box, Typography, Avatar, ListItem } from "@mui/material";
import { Link } from "react-router-dom";
import type { Post } from "../../../../models";
import { useCommentsCount } from "../../../../hooks/useCounter";
import { useAuthor } from "../../../../hooks/useAuthor";
import { useWilsonScore, getRecommendationLabel } from "../../../../hooks/useWilsonScore";

interface PostSidebarItemProps {
  post: Post;
  plan: string;
  course: string;
  isActive: boolean;
}

export default function PostSidebarItem({ post, plan, course, isActive }: PostSidebarItemProps) {
  const { user: author, loading } = useAuthor(post.userId || null);
  const commentsCount = useCommentsCount(post._id || "0");
  const score = useWilsonScore(post.likeCount ?? 0, post.dislikeCount ?? 0);
  const totalVotes = (post.likeCount ?? 0) + (post.dislikeCount ?? 0);
  const recommendation = getRecommendationLabel(score, totalVotes);
  const recommendationLabel = recommendation.label;
  const recommendationColor = recommendation.color;
  return (
    <ListItem
      key={post._id}
      component={Link}
      to={`/student/${plan}/${course}/${post._id}`}
      className="post-sidebar-item"
      sx={{
        "&:hover": { bgcolor: "#ff000026" },
        color: "text.primary",
        flexDirection: "column",
        alignItems: "stretch",
        ...(isActive && {
          bgcolor: "#ff000026",
          border: "1px solid",
          borderColor: "rgba(255, 0, 0, 0.5)",
          fontWeight: "bold",
        }),
      }}
    >
      <Box style={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
        <Avatar className="avatar" />
        <Typography variant="body2" fontWeight="bold">
          {author ? author.userName : loading ? "Cargando..." : "Desconocido"}
        </Typography>
        <Typography variant="body2" style={{ marginLeft: 4 }}>
          {new Date(post.createdAt).toLocaleDateString()}
        </Typography>
      </Box>

      <Typography variant="subtitle1" fontWeight="bold">
        {post.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" noWrap>
        {post.description}
      </Typography>

      <Box style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
        <Typography variant="caption">{commentsCount} comentarios</Typography>
        {post.type === "S" && (
          <Typography variant="caption" style={{ color: recommendationColor }}>
            {recommendationLabel}
          </Typography>
        )}
      </Box>
    </ListItem>
  );
}
