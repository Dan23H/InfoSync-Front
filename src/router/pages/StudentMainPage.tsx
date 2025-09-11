import { Box, Grid, Typography } from "@mui/material";
import { CoursesBySemester, CourseSearch, SemesterSelect, PlanSelect } from "../../components/apps/student/courses";
import { useCourses } from "../../hooks/useCourses";

export default function StudentMainPage() {
  const {
    data: data,
        loading: loading,
        error: error,
        planSeleccionado: planSeleccionado,
        setPlanSeleccionado: setPlanSeleccionado,
        semestreSeleccionado: semestreSeleccionado,
        setSemestreSeleccionado: setSemestreSeleccionado,
        asignaturaSeleccionada: asignaturaSeleccionada,
        setAsignaturaSeleccionada: setAsignaturaSeleccionada,
        mostrarSugerencias: mostrarSugerencias,
        setMostrarSugerencias: setMostrarSugerencias,
        sugerencias: sugerencias,
        cursosPorSemestre: cursosPorSemestre,
  } = useCourses();

  if (loading) return <Typography>Cargando...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <PlanSelect plans={data} value={planSeleccionado} onChange={setPlanSeleccionado} />

      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12, sm: 12, md: 4 }}>
          <Typography variant="h6" align="center">
            Filtros opcionales:
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 4 }}>
          <SemesterSelect
            semesters={data.find((p) => p._id === planSeleccionado)?.semesters.map((s) => s.semesterNumber) ?? []}
            value={semestreSeleccionado}
            onChange={setSemestreSeleccionado}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 4 }}>
          <CourseSearch
            value={asignaturaSeleccionada}
            onChange={setAsignaturaSeleccionada}
            suggestions={sugerencias}
            showSuggestions={mostrarSugerencias}
            setShowSuggestions={setMostrarSugerencias}
          />
        </Grid>
      </Grid>

      <CoursesBySemester groupedCourses={cursosPorSemestre} />
    </Box>
  );
}
