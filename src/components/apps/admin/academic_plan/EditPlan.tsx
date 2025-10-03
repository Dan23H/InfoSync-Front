import { useEffect, useState, useCallback } from "react";
import { Box, Button, Typography, TextField, Grid } from "@mui/material";
import Selector from "./Selector";
import CustomTextbox from "./CustomTextbox";

import type { Pensum, CourseDto } from "../../../../models";
import { getPensumById, updatePensum } from "../../../../api/endpoints";
import ErrorAlert from "../../../common/ErrorAlert";
import { useAuth } from "../../../../context/AuthContext";

interface EditPlanProps {
  id: string | null;
  onClose: () => void;
}

export default function EditPlan({ id, onClose }: EditPlanProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<Pensum | null>(null);
  const [semestreActual, setSemestreActual] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const fetchPlan = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const apiPlan = await getPensumById(id);
      setPlan(apiPlan);
      setSemestreActual(apiPlan.semesters[0]?.semesterNumber ?? 1);
    } catch (e: any) {
      setError(e.message ?? "Error al cargar el plan.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  const handleAdd = (newCourse: CourseDto) => {
    if (!plan) return;
    setPlan((prev) =>
      prev
        ? {
          ...prev,
          semesters: prev.semesters.map((s) =>
            s.semesterNumber === semestreActual
              ? { ...s, courses: [...s.courses, newCourse] }
              : s
          ),
        }
        : prev
    );
  };

  const handleDelete = (index: number) => {
    if (!plan) return;
    setPlan((prev) =>
      prev
        ? {
          ...prev,
          semesters: prev.semesters.map((s) =>
            s.semesterNumber === semestreActual
              ? {
                ...s,
                courses: s.courses.filter((_, i) => i !== index),
              }
              : s
          ),
        }
        : prev
    );
  };

  const handleUpdate = (index: number, updated: CourseDto) => {
    if (!plan) return;
    setPlan((prev) =>
      prev
        ? {
          ...prev,
          semesters: prev.semesters.map((s) =>
            s.semesterNumber === semestreActual
              ? {
                ...s,
                courses: s.courses.map((c, i) =>
                  i === index ? updated : c
                ),
              }
              : s
          ),
        }
        : prev
    );
  };

  const setCantidadSemestres = (count: number) => {
    if (!plan) return;
    setPlan((prev) =>
      prev
        ? {
          ...prev,
          totalSemesters: count,
          semesters: Array.from({ length: count }, (_, i) => {
            const semesterNumber = i + 1;
            const existente = prev.semesters.find(
              (s) => s.semesterNumber === semesterNumber
            );
            return {
              semesterNumber,
              courses: existente?.courses ?? [],
            };
          }),
        }
        : prev
    );
    if (semestreActual > count) setSemestreActual(count);
  };

  const handleSubmitPlan = async () => {
    if (!plan) return;
    if (!user?._id) {
      alert("No se detectó un usuario válido para actualizar el plan.");
      return;
    }

    try {
      const payload = {
        name: plan.name,
        description: plan.description,
        userId: user._id,
        totalSemesters: plan.totalSemesters,
        semesters: plan.semesters.map((s) => ({
          semesterNumber: s.semesterNumber,
          courses: s.courses.map((c) => ({
            name: c.name,
            type: c.type,
          })),
        })),
      };

      await updatePensum(plan._id, payload);
      alert("Plan actualizado correctamente");
      await fetchPlan();
      onClose();
    } catch (e: any) {
      alert(`Error al actualizar: ${e.message ?? e}`);
    }
  };

  if (!id) return (
    <Box>
      <Typography variant="body1">
        No se detectó ninguna ID para editar.
      </Typography>
    </Box>
  );
  if (loading) return (
    <Box>
      <Typography variant="h5">
        Cargando...
      </Typography>
    </Box>);
  if (error) return (
    <Box>
      <ErrorAlert
        message={error}
        actionLabel="Intentar de nuevo más tarde"
        onAction={() => setError(null)}
      />
    </Box>
  );
  if (!plan) return (
    <Box>
      <Typography variant="body1">
        Todavía no hay ningún plan registrado.
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ p: 3, flexGrow: 2 }}>
      <Typography variant="h5" gutterBottom>
        Editar Plan de Estudio
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Nombre del plan"
            value={plan.name}
            onChange={(e) => setPlan({ ...plan, name: e.target.value })}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField label="Semestre" fullWidth disabled value=" " />
          <Box
            sx={{
              position: "relative",
              top: "-45px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Selector
              semestre={plan.totalSemesters}
              setSemestre={setCantidadSemestres}
              seleccion={semestreActual}
              setSeleccion={setSemestreActual}
            />
          </Box>
        </Grid>
      </Grid>

      <Grid sx={{ xs: 12, md: 12 }}>
        <TextField
          fullWidth
          multiline
          minRows={3}
          label="Descripción"
          value={plan.description ?? ""}
          inputProps={{ maxLength: 50 }}
          helperText={`${plan.description?.length ?? 0}/50 caracteres`}
          onChange={(e) =>
            setPlan((prev) =>
              prev ? { ...prev, description: e.target.value } : prev
            )
          }
        />
      </Grid>

      <CustomTextbox
        planName={plan.name}
        semestre={semestreActual}
        asignaturas={
          plan.semesters.find((s) => s.semesterNumber === semestreActual)
            ?.courses || []
        }
        onAdd={handleAdd}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />

      <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
        <Button variant="outlined" color="inherit" onClick={fetchPlan}>
          Reestablecer
        </Button>
        <Button variant="contained" onClick={handleSubmitPlan}>
          Guardar cambios
        </Button>
      </Box>
    </Box>
  );
}
