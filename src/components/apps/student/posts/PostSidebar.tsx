import { Box, Typography, Avatar, Card, CardContent, List, ListItem, Divider, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import type { Post } from "../../../../models";
import { Typewriter } from "react-simple-typewriter";

interface PostSidebarProps {
  posts: Post[];
  postId?: string;
  plan: string;
  course: string;
}

export default function PostSidebar({ posts, postId, plan, course }: PostSidebarProps) {
  const post = posts.find((p) => p._id === postId);
  
  return (
    <>
      <Grid sx={{ bgcolor: "rgba(0, 0, 0, 0.2)", mb: 2, p: 1, borderRadius: 1, height: "7vh" }}>
        <Typography variant="h6" position={"sticky"} align="center">
          Publicaciones de{" "}
          <Typography variant="h6" component="span" color="rgba(0, 150, 0, 1)" fontWeight="bold">
            <Typewriter
              words={[course, post!.course]}
              loop={1} // Cambiado a 2 para que no sea infinito
              cursor
              cursorStyle="_"
              typeSpeed={70}
              deleteSpeed={50} 
              delaySpeed={2000}
            />
          </Typography>
        </Typography>

        <Divider sx={{ mb: 1 }} />
      </Grid>
      <Card sx={{ height: "89vh", overflowY: "auto" }}>
        <CardContent>
          <List>
            {posts
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((p) => (
                <ListItem
                  key={p._id}
                  component={Link}
                  to={`/student/${plan}/${course}/${p._id}`}
                  sx={{
                    textDecoration: "none",
                    border: "1px solid rgba(255,0,0,0.25)",
                    borderRadius: 1,
                    mb: 1,
                    "&:hover": { bgcolor: "rgba(255, 0, 0, 0.15)" },
                    color: "text.primary",
                    flexDirection: "column",
                    alignItems: "stretch",
                    ...(p._id === postId && {
                      bgcolor: "rgba(255, 0, 0, 0.3)",
                      border: "1px solid",
                      borderColor: "rgba(255, 0, 0, 0.5)",
                      fontWeight: "bold",
                    }),
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                    <Avatar sx={{ width: 15, height: 15, mr: 1 }} />
                    <Typography variant="body2" fontWeight="bold">
                      {p.userId}
                    </Typography>
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {new Date(p.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>

                  <Typography variant="subtitle1" fontWeight="bold">
                    {p.title}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" noWrap>
                    {p.description}
                  </Typography>

                  <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
                    <Typography variant="caption">{0} comentarios</Typography>
                    {p.type === "S" && (
                      <Typography variant="caption" color="success.main">
                        Recomendado
                      </Typography>
                    )}
                  </Box>
                </ListItem>
              ))}
          </List>
        </CardContent>
      </Card>
    </>
  );
}
