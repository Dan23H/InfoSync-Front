import { useParams } from "react-router-dom";
import { Typography } from "@mui/material";
import { usePosts } from "../../hooks/usePosts";
import PostCard from "../../components/apps/student/posts/PostCard";

export default function PostPage() {
  const { plan, course, post: postId } = useParams<{ 
    plan: string; 
    course: string; 
    post: string;
  }>();

  const { data: posts, loading, error } = usePosts(plan, course);

  if (loading) return <Typography>Cargando post...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  const post = posts.find((p) => p._id === postId);
  if (!post) return <Typography>No se encontró el post</Typography>;

  return <PostCard post={post} />;
}
