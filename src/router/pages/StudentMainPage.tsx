import { Box, Grid, Typography } from "@mui/material";
import { CoursesBySemester, CourseSearch, SemesterSelect, PlanSelect } from "../../components/apps/student/courses";
import { useCourses } from "../../hooks/useCourses";
import ErrorAlert from "../../components/common/ErrorAlert";
import { usePlan } from "../../context/PlanContext";
import { useEffect } from "react";

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

  const { planId, setPlanId } = usePlan();

  useEffect(() => {
    if (data && data.length > 0) {
      if (!planSeleccionado) {
        if (planId) {
          setPlanSeleccionado(planId);
        } else {
          const defaultPlanId = data[data.length - 1]._id;
          setPlanSeleccionado(defaultPlanId);
          setPlanId(defaultPlanId);
        }
      }
    }
  }, [data, planId, setPlanId, setPlanSeleccionado]);


  if (loading) return <Typography>Cargando...</Typography>;
  if (error) return <ErrorAlert
    message={error}
    actionLabel="Intentar de nuevo"
    onAction={() => error}
  />;
  console.log(planSeleccionado)
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <PlanSelect
        plans={data}
        value={planSeleccionado}
        onChange={(id: string) => {
          setPlanSeleccionado(id);
          setPlanId(id);
        }}
      />

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
