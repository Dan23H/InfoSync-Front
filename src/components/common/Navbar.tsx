import { AppBar, Toolbar, Button, Box, Typography, Menu, MenuItem, Avatar, IconButton } from "@mui/material";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { usePostModal } from "../../context/PostModalContext";
import { usePlan } from "../../context/PlanContext";
import { usePensums } from "../../hooks/usePensums";
import { slugify } from "../../utils/slugify";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { openModal } = usePostModal();
  const { planId } = usePlan();
  const { course } = useParams<{ plan?: string; course?: string }>();
  const { fetchPensumById } = usePensums();
  const [pensum, setPensum] = useState<{ name: string } | null>(null);

  const [courseName, setCourseName] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const isAdmin = user?.role === "admin";
  const isStudentView = location.pathname.startsWith("/student");

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
      setPensum(pensum ? { name: pensum.name } : null);
    });
  }, [planId, course]);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

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
          {/* Home / Cambiar vista */}
          {isAdmin ? (
            <>
              <Button
                color="inherit"
                onClick={() => navigate(isStudentView ? "/admin" : "/student")}
              >
                {isStudentView ? "Ir a vista administrador" : "Ir a vista estudiante"}
              </Button>
              {isStudentView && (
                <>
                  <Button color="inherit" onClick={() => navigate("/student")}>
                    {courseName ? `${pensum?.name} - ${courseName}` : "Home"}
                  </Button>
                  <Button color="inherit" onClick={handleNewPost}>
                    <Typography>Crear publicación</Typography>
                  </Button>
                </>
              )}
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate("/student")}>
                {courseName ? `Ingeniería Informática - ${courseName}` : "Home"}
              </Button>
              <Button color="inherit" onClick={handleNewPost}>
                <Typography>Crear publicación</Typography>
              </Button>
            </>
          )}
        </Box>

        {/* Avatar y menú */}
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
