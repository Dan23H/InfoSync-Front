import { useParams } from "react-router-dom";
import { Typography } from "@mui/material";
import { usePosts } from "../../hooks/usePosts";
import PostList from "../../components/apps/student/posts/PostList";

export default function PostsPage() {
  const { plan, course } = useParams<{ plan: string; course: string }>();
  const { data: posts, loading, error } = usePosts(plan, course);

  if (loading) return <Typography>Cargando posts...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return <PostList posts={posts} course={course ?? ""} />;
}