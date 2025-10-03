import { Card, CardContent, List } from "@mui/material";
import type { Post } from "../../../../models";
import PostSidebarItem from "./PostSidebarItem";

interface PostSidebarProps {
  posts: Post[];
  postId?: string;
  plan: string;
  course: string;
}

export default function PostSidebar({ posts, postId, plan, course }: PostSidebarProps) {
  return (
      <Card sx={{ height: "89vh", overflowY: "auto" }}>
        <CardContent>
          <List>
            {posts
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
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
