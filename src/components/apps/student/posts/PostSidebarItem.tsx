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
      sx={{
        textDecoration: "none",
        border: "1px solid rgba(255,0,0,0.25)",
        bgcolor: "#AB9B9B",
        borderRadius: 1,
        mb: 1,
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
      <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
        <Avatar sx={{ width: 15, height: 15, mr: 1 }} />
        <Typography variant="body2" fontWeight="bold">
          {author ? author.userName : loading ? "Cargando..." : "Desconocido"}
        </Typography>
        <Typography variant="body2" sx={{ ml: 1 }}>
          {new Date(post.createdAt).toLocaleDateString()}
        </Typography>
      </Box>

      <Typography variant="subtitle1" fontWeight="bold">
        {post.title}
      </Typography>

      <Typography variant="body2" color="text.secondary" noWrap>
        {post.description}
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
        <Typography variant="caption">{commentsCount} comentarios</Typography>
        {post.type === "S" && (
          <Typography variant="caption" sx={{color: recommendationColor}}>
            {recommendationLabel}
          </Typography>
        )}
      </Box>
    </ListItem>
  );
}
