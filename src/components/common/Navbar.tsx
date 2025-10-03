import { AppBar, Toolbar, Button, Box, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { usePostModal } from "../../context/PostModalContext";
import { usePlan } from "../../context/PlanContext";
import { usePensums } from "../../hooks/usePensums";
import { slugify } from "../../utils/slugify";
import { useEffect, useState } from "react";
import { Typewriter } from "react-simple-typewriter";

export default function Navbar() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { openModal } = usePostModal();
  const { planId } = usePlan();
  const { fetchPensumById } = usePensums();

  const { course } = useParams<{ course?: string }>();

  const [courseName, setCourseName] = useState<string | null>(null);

  useEffect(() => {
    if (!planId || !course) {
      setCourseName(null);
      return;
    }

    fetchPensumById(planId).then((pensum) => {
      const found = pensum?.semesters
        .flatMap((s: any) => s.courses)
        .find((c: any) => slugify(c.name) === course);
      setCourseName(found?.name || null);
    });
  }, [planId, course]);

  const handleNewPost = async () => {
    if (!planId) return;

    const pensum = await fetchPensumById(planId);
    const courses = pensum?.semesters?.flatMap((s: any) => s.courses) || [];

    openModal({
      courses,
      initialData: course
        ? { course: courses.find((c: any) => slugify(c.name) === course)?.name }
        : undefined,
    });
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: "flex", gap: 2, alignItems: "center" }}>
          <Button color="inherit" onClick={() => navigate("/student")}>
            <Typewriter
                          words={[courseName? `Ingeniería Informática - ${courseName}` : "Home"]}
                          loop={1}
                          cursor
                          cursorStyle="_"
                          typeSpeed={70}
                          deleteSpeed={50}
                          delaySpeed={2000}
                        /> {courseName}
          </Button>
          <Button color="inherit" onClick={handleNewPost}>
            <Typography>
              Crear publicación
            </Typography>
          </Button>
          <Button color="inherit" onClick={() => navigate("/student/profile")}>
            <Typography>
              Editar Perfil
            </Typography>
          </Button>
        </Box>
        <Button
          color="inherit"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          <Typography>
              Cerrar sesión
            </Typography>
        </Button>
      </Toolbar>
    </AppBar>
  );
}
