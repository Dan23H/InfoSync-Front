import { useNavigate, useParams, useLocation } from "react-router-dom";
import { usePosts } from "../../hooks/usePosts";
import { usePensums } from "../../hooks/usePensums";
import { useEffect, useState, useContext } from "react";
import { Typography, IconButton, Card, CardHeader, CardContent, Collapse, Grid, Fab } from "@mui/material";
import PostCard from "../../components/apps/student/posts/PostCard";
import { usePlan } from "../../context/PlanContext";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../hooks/useSocket";
import SocketContext from "../../context/SocketContext";
import { AiFillEye, AiFillEyeInvisible, AiFillHome } from "react-icons/ai";

const WSS_API_URL = import.meta.env.WSS_API_URL || "ws://localhost:3000";

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

  const navigate = useNavigate();
  const { SocketDispatch } = useContext(SocketContext);
  const socket = useSocket(WSS_API_URL, {
    autoConnect: false,
    reconnectionAttempts: 5,
    reconnectionDelay: 5000,
  });

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    const user = localStorage.getItem("user");

    if (token && user) {
      socket.io.opts.query = { token, user };
      socket.connect();
      SocketDispatch({ type: "update_socket", payload: socket });
    } else {
      console.error("Missing token or user in localStorage. Socket will not connect.");
    }

    return () => {
      socket.disconnect();
    };
  }, [socket, SocketDispatch]);

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

  const sortedPosts = posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const questions = sortedPosts?.filter((p) => p.type === "Q") ?? [];
  const suggestions = sortedPosts?.filter((p) => p.type === "S") ?? [];

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
          {<AiFillHome />}
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
                <IconButton>
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
      </Grid>
    </>
  );
}
