import { Box, Typography, IconButton, Chip, Menu, MenuItem, Card, CardContent, CardActions, Avatar } from "@mui/material";
import { useState } from "react";
import type { Post } from "../../../../models/types";

interface PostCardProps {
  post: Post;
  currentUserId?: string; // lo pasamos desde arriba si se quiere
}

export default function PostCard({ post, currentUserId }: PostCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const open = Boolean(anchorEl);

  // validación editar: mismo user y < 2 horas
  const canEdit =
    post.userId === currentUserId &&
    Date.now() - new Date(post.createdAt).getTime() < 2 * 60 * 60 * 1000;

  return (
    <Card sx={{ mb: 2, backgroundColor: "#e0e0e0" }}>
      <CardContent>
        {/* Encabezado */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar sx={{ width: 24, height: 24, bgcolor: "brown" }} />
            <Typography variant="body2" fontWeight="bold">
              {post.userId}
            </Typography>
            <Typography variant="body2">
              {new Date(post.createdAt).toLocaleDateString()}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Chip
              label={post.type === "Q" ? "Pregunta" : "Sugerencia"}
              size="small"
              color={post.type === "Q" ? "default" : "primary"}
            />
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
              {"MoreVertIcon"}
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={() => setAnchorEl(null)}
            >
              {canEdit && <MenuItem>Editar</MenuItem>}
              <MenuItem>Eliminar</MenuItem>
              <MenuItem>Reportar</MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Contenido */}
        <Typography variant="h6">{post.title}</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          {post.description}
        </Typography>
      </CardContent>

      {/* Footer */}
      <CardActions sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Typography variant="body2">x – Comentarios</Typography>
          <Typography variant="body2" sx={{ cursor: "pointer" }}>
            Compartir
          </Typography>
          {post.type === "S" && (   
            <Typography variant="body2" color="primary">
              Recomendado
            </Typography>
          )}
        </Box>

        {post.type === "S" && (
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              onClick={() => {
                setLiked(!liked);
                if (disliked) setDisliked(false);
              }}
            >
              {liked ? "FavoriteIconSelected" : "FavoriteIconUnselected"}
            </IconButton>
            <IconButton
              onClick={() => {
                setDisliked(!disliked);
                if (liked) setLiked(false);
              }}
            >
              {"FavoriteIconSelected" /* ícono rotado */}
            </IconButton>
            <IconButton>
              {"BookmarkIcon"}
            </IconButton>
          </Box>
        )}
      </CardActions>
    </Card>
  );
}
