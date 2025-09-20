import { Box, Typography, IconButton, Chip, Menu, MenuItem, Card, CardContent, CardActions, Avatar } from "@mui/material";
import { useState } from "react";
import type { Post } from "../../../../models";
import { Link } from "react-router-dom";
import { slugify } from "../../../../utils/slugify";
import { AddBookmarkSVG, BookmarkSVG, DislikeSelected, DislikeUnselected, LikeSelected, LikeUnselected } from "../../../../assets";


interface PostCardProps {
  post: Post;
  currentUserId?: string; // lo pasamos desde arriba si se quiere
}

export default function PostCard({ post, currentUserId }: PostCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const open = Boolean(anchorEl);

  // validación editar: mismo user y < 2 horas
  const canEdit =
    post.userId === currentUserId &&
    Date.now() - new Date(post.createdAt).getTime() < 2 * 60 * 60 * 1000;

  return (
    <Card sx={{ mb: 2, backgroundColor: "#fff", border: "1px solid #ccc", borderRadius: 2, boxShadow: 1, }}>
      <CardContent
        component={Link}
        to={`/student/${post.pensumId}/${slugify(post.course)}/${post._id}`}
        sx={{ textDecoration: "none", color: "inherit" }}
      >
        {/* Encabezado */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1, ml: 2, mr: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar sx={{ width: 24, height: 24, bgcolor: "brown" }} />
            <Typography variant="body2" fontWeight="bold">
              {post.userId}
            </Typography>
            <Typography variant="body2">
              {new Date(post.createdAt).toLocaleDateString()}
            </Typography>
          </Box>

          {/* Menú de opciones */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Chip
              label={post.type === "Q" ? "Pregunta" : "Sugerencia"}
              size="small"
              sx={{ bgcolor: post.type === "Q" ? "#787777" : "#006387", color: "#fff" }}
            />
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setAnchorEl(e.currentTarget);
              }}
              
            >
              {"⋮⋮⋮"}
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={() => setAnchorEl(null)}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              {canEdit && <MenuItem onClick={() => console.log("Editar")}>Editar</MenuItem>}
              <MenuItem onClick={() => console.log("Reportar")}>Reportar</MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Contenido del post */}
        <Typography variant="h6" sx={{ ml: 2, mr: 2, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" }}>{post.title}</Typography>
        <Typography variant="body2" sx={{ mt: 1, ml: 2, mr: 2, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" }}>
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

        <Box sx={{ display: "flex", gap: 1 }}>
          {post.type === "S" && (
            <>
              <IconButton
                onClick={() => {
                  setLiked(!liked);
                  if (disliked) setDisliked(false);
                }}
              >
                {liked ? <img src={LikeSelected} alt="like" width={22} height={22} /> : <img src={LikeUnselected} alt="like" width={22} height={22} />}
              </IconButton>
              <IconButton
                onClick={() => {
                  setDisliked(!disliked);
                  if (liked) setLiked(false);
                }}
              >
                {disliked ? <img src={DislikeSelected} alt="dislike" width={22} height={22} /> : <img src={DislikeUnselected} alt="dislike" width={22} height={22} />}
              </IconButton>
            </>
          )}
          <IconButton
            onClick={() => {
              setBookmarked(!bookmarked);
            }}
          >
            {bookmarked ? <img src={BookmarkSVG} alt="bookmark" width={20} height={20} /> : <img src={AddBookmarkSVG} alt="bookmark" width={20} height={20} style={{ filter: "grayscale(100%)" }} />}
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  );
}
