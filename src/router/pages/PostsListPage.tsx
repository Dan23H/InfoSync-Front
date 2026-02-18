import { useParams, useLocation } from "react-router-dom";
import { usePosts } from "../../hooks/usePosts";
import { usePensums } from "../../hooks/usePensums";
import { useEffect, useState, useContext } from "react";
import { Typography, IconButton, Card, CardHeader, CardContent, Collapse, Grid } from "@mui/material";
import SearchResults from "../../components/apps/student/posts/SearchResults";
import PostCard from "../../components/apps/student/posts/PostCard";
import { usePlan } from "../../context/PlanContext";
import { useAuth } from "../../context/AuthContext";
import SocketContext from "../../context/SocketContext";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function PostsListPage() {
  const { plan: planFromUrl, course } = useParams<{ plan: string; course: string }>();
  const { planId } = usePlan();
  const { user } = useAuth();
  const plan = planId ?? planFromUrl;

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const q = params.get("q")?.trim().toLowerCase() || "";

  const { data: postsRaw, loading: postsLoading, error: postsError } = usePosts(plan, course); // Revisar
  const posts = postsRaw?.filter((p: any) => {
    if (!q) return true;
    const inTitle = p.title?.toLowerCase().includes(q);
    const inSubject = p.subject?.toLowerCase().includes(q);
    return Boolean(inTitle || inSubject);
  }) ?? [];
  const { fetchPensumById } = usePensums();
  const [pensum, setPensum] = useState<any>(null);
  const [pensumLoading, setPensumLoading] = useState(true);
  const [pensumError, setPensumError] = useState<string | null>(null);

  const [showQuestions, setShowQuestions] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(true);

  useContext(SocketContext);

  useEffect(() => {
    if (!plan) return;
    setPensumLoading(true);
    fetchPensumById(plan)
      .then((res) => setPensum(res))
      .catch((err) => setPensumError(err.message))
      .finally(() => setPensumLoading(false));
  }, [plan]);


  const sortedPosts = posts.slice().sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (postsLoading || pensumLoading) return <Typography>Cargando...</Typography>;
  if (postsError) return <Typography color="error">{postsError}</Typography>;
  if (pensumError) return <Typography color="error">{pensumError}</Typography>;
  if (!pensum) return <Typography>No se encontró el plan académico.</Typography>;

  const questions = sortedPosts?.filter((p) => p.type === "Q") ?? [];
  const suggestions = sortedPosts?.filter((p) => p.type === "S") ?? [];

  const openedCount = [showQuestions, showSuggestions].filter(Boolean).length;
  const gridSize = openedCount === 2 ? 6 : 12;

  return (
    <main role="main">
      <Grid container spacing={2}>
        {q ? (
          <>
            {/* Resultados de la Query */}
            <SearchResults posts={posts} query={params.get("q")} currentUserId={user._id} />
          </>
        ) : (
          <>
            {/* Preguntas */}
            <Grid size={{ xs: 12, md: gridSize }}>
              <Card sx={{ mb: 2 }}>
                <CardHeader
                  title="Preguntas"
                  onClick={() => setShowQuestions((prev) => !prev)}
                  sx={{ ":hover": { cursor: "pointer" } }}
                  action={
                    <IconButton aria-label={showQuestions ? "Ocultar preguntas" : "Mostrar preguntas"}>
                      <Typography variant="body2" sx={{ mr: 1 }}>{showQuestions ? "Ocultar preguntas" : "Mostrar preguntas"}</Typography>
                      {showQuestions ? <AiFillEyeInvisible /> : <AiFillEye />}
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
                    <IconButton aria-label={showSuggestions ? "Ocultar sugerencias" : "Mostrar sugerencias"}>
                      <Typography variant="body2" sx={{ mr: 1 }}>{showSuggestions ? "Ocultar sugerencias" : "Mostrar sugerencias"}</Typography>
                      {showSuggestions ? <AiFillEyeInvisible /> : <AiFillEye />}
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
          </>
        )}
      </Grid>
    </main>
  );
}
