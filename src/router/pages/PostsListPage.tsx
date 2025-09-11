import { useNavigate, useParams } from "react-router-dom";
import { usePosts } from "../../hooks/usePosts";
import { usePensums } from "../../hooks/usePensums";
import { useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";
import { slugify } from "../../utils/slugify";
import PostList from "../../components/apps/student/posts/PostList";
import ModalPost from "../../components/apps/student/post_modal/ModalPost";

export default function PostsListPage() {
  const { plan, course } = useParams<{ plan: string; course: string }>();
  const { data: posts, loading: postsLoading, error: postsError, addPost } = usePosts(plan, course);
  const { fetchPensumById } = usePensums();

  const [open, setOpen] = useState(false);
  const [pensum, setPensum] = useState<any>(null);
  const [pensumLoading, setPensumLoading] = useState(true);
  const [pensumError, setPensumError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!plan) return;
    setPensumLoading(true);
    fetchPensumById(plan)
      .then((res) => setPensum(res))
      .catch((err) => setPensumError(err.message))
      .finally(() => setPensumLoading(false));
  }, [plan]);

  if (postsLoading || pensumLoading) return <Typography>Cargando...</Typography>;
  if (postsError) return <Typography color="error">{postsError}</Typography>;
  if (pensumError) return <Typography color="error">{pensumError}</Typography>;
  if (!pensum) return <Typography>No se encontró el plan académico.</Typography>;

  const courseName =
    pensum.semesters
      .flatMap((s: any) => s.courses)
      .find((c: any) => slugify(c.name) === course)?.name || course;

  return (
    <>
      <Button
        variant="contained"
        color="error"
        onClick={() => navigate(`/student`)}
        sx={{ mb: 2 }}
      >
        Volver
      </Button>

      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpen(true)}
        sx={{ mb: 2 }}
      >
        Nuevo Post
      </Button>

      <PostList posts={posts ?? []} course={courseName} />

      <ModalPost
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={(data) => addPost(data, plan!)}
        courses={pensum.semesters.flatMap((s: any) => s.courses)}
      />
    </>
  );
}
