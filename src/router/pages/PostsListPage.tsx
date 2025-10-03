import { useNavigate, useParams } from "react-router-dom";
import { usePosts } from "../../hooks/usePosts";
import { usePensums } from "../../hooks/usePensums";
import { useEffect, useState } from "react";
import { Typography, IconButton, Card, CardHeader, CardContent, Collapse, Grid, Fab } from "@mui/material";
import PostCard from "../../components/apps/student/posts/PostCard";
import { usePlan } from "../../context/PlanContext";
import { useAuth } from "../../context/AuthContext";

export default function PostsListPage() {
  const { plan: planFromUrl, course } = useParams<{ plan: string; course: string }>();
  const { planId } = usePlan();
  const { user } = useAuth();
  const plan = planId ?? planFromUrl;

  const { data: posts, loading: postsLoading, error: postsError } = usePosts(plan, course);
  const { fetchPensumById } = usePensums();
  const [pensum, setPensum] = useState<any>(null);
  const [pensumLoading, setPensumLoading] = useState(true);
  const [pensumError, setPensumError] = useState<string | null>(null);

  const [showQuestions, setShowQuestions] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(true);

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

  const questions = posts?.filter((p) => p.type === "Q") ?? [];
  const suggestions = posts?.filter((p) => p.type === "S") ?? [];

  const openedCount = [showQuestions, showSuggestions].filter(Boolean).length;
  const gridSize = openedCount === 2 ? 6 : 12;

  return (
    <>
      <Grid container spacing={2}>
        <Fab
          color="error"
          aria-label="inicio"
          onClick={() => navigate("/student")}
          sx={{ position: "fixed", bottom: 16, left: 16 }}
        >
          {"<"}
        </Fab>

        {/* Preguntas */}
        <Grid size={{ xs: 12, md: gridSize }}>
          <Card sx={{ mb: 2 }}>
            <CardHeader
              title="Preguntas"
              onClick={() => setShowQuestions((prev) => !prev)}
              sx={{ ":hover": { cursor: "pointer" } }}
              action={
                <IconButton>
                  {showQuestions ? "^" : "v"}
                </IconButton>
              }
            />
            <Collapse in={showQuestions} timeout="auto" unmountOnExit>
              <CardContent>
                {questions.length === 0 ? (
                  <Typography variant="body2">No hay preguntas todavía.</Typography>
                ) : (
                  questions.map((q) => <PostCard key={q._id} post={q} currentUserId={user._id} />)
                )}
              </CardContent>
            </Collapse>
          </Card>
        </Grid>

        {/* Sugerencias */}
        <Grid size={{ xs: 12, md: gridSize }}>
          <Card sx={{ mb: 2 }}>
            <CardHeader
              title="Sugerencias"
              onClick={() => setShowSuggestions((prev) => !prev)}
              sx={{ ":hover": { cursor: "pointer" } }}
              action={
                <IconButton>
                  {showSuggestions ? "^" : "v"}
                </IconButton>
              }
            />
            <Collapse in={showSuggestions} timeout="auto" unmountOnExit>
              <CardContent>
                {suggestions.length === 0 ? (
                  <Typography variant="body2">No hay sugerencias todavía.</Typography>
                ) : (
                  suggestions.map((s) => <PostCard key={s._id} post={s} currentUserId={user._id} />)
                )}
              </CardContent>
            </Collapse>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
