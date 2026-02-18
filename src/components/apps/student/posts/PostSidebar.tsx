import { Card, CardContent, List, Typography } from "@mui/material";
import type { Post } from "../../../../models";
import PostSidebarItem from "./PostSidebarItem";
import "../../../../styles/student-posts.css";

interface PostSidebarProps {
  posts: Post[];
  postId?: string;
  plan: string;
  course: string;
}

export default function PostSidebar({ posts, postId, plan, course }: PostSidebarProps) {
  const sameType = posts.find((p) => p._id === postId)?.type || "Q";
  return (
    <Card className="post-sidebar">
      <CardContent>
        <Typography>{sameType === "Q" ? "Más Preguntas Relacionadas" : "Más Sugerencias Relacionadas"}</Typography>
        <List>
          {posts
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .filter((p) => p.type === sameType)
            .map((p) => (
              <PostSidebarItem
                key={p._id}
                post={p}
                plan={plan}
                course={course}
                isActive={p._id === postId}
              />
            ))}
        </List>
      </CardContent>
    </Card>
  );
}
