import { AppBar, Toolbar, Button, Box, Typography, Menu, MenuItem, Avatar, IconButton } from "@mui/material";
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
  const { user, logout } = useAuth();
  const { openModal } = usePostModal();
  const { planId } = usePlan();
  const { fetchPensumById } = usePensums();
  const { course } = useParams<{ course?: string }>();

  const [courseName, setCourseName] = useState<string | null>(null);

  // Estado para el menú
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

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
        {/* Izquierda */}
        <Box sx={{ flexGrow: 1, display: "flex", gap: 2, alignItems: "center" }}>
          <Button color="inherit" onClick={() => navigate("/student")}>
            <Typewriter
              words={[courseName ? `Ingeniería Informática - ${courseName}` : "Home"]}
              loop={1}
              cursor
              cursorStyle="_"
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={2000}
            /> {courseName}
          </Button>
          <Button color="inherit" onClick={handleNewPost}>
            <Typography>Crear publicación</Typography>
          </Button>
        </Box>

        {/* Avatar del usuario con menú */}
        <IconButton onClick={handleMenuClick} sx={{ p: 0 }}>
          <Avatar
            src={user?.avatar || ""}
            alt={user?.userName || "Perfil"}
          >
            {!user?.avatar && user?.userName ? user.userName[0].toUpperCase() : ""}
          </Avatar>
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem
            onClick={() => {
              navigate("/student/profile");
              handleMenuClose();
            }}
          >
            Ver perfil
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigate("/student/profile/edit");
              handleMenuClose();
            }}
          >
            Editar perfil
          </MenuItem>
          <MenuItem
            onClick={() => {
              logout();
              navigate("/login");
              handleMenuClose();
            }}
          >
            Cerrar sesión
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
