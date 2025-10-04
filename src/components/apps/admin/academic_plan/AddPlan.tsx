import { useState } from "react";
import { Box, Button, Typography, TextField, Select, MenuItem, FormControl, InputLabel, Grid } from "@mui/material";
import CustomTextbox from "./CustomTextbox";
import Selector from "./Selector";
import type { Pensum, CourseDto } from "../../../../models";
import { createPensum } from "../../../../api";
import { usePensums } from "../../../../hooks/usePensums";
import { useAuth } from "../../../../context/AuthContext";

interface AddPlanProps {
  onClose: () => void;
}

export default function AddPlan({ onClose }: AddPlanProps) {
  const [planName, setPlanName] = useState("");
  const [semestreActual, setSemestreActual] = useState(1);
  const [semestresTotales, setSemestresTotales] = useState(9);
  const [planAnterior, setPlanAnterior] = useState("No");
  const { data: pensums, loading } = usePensums();
  const { user } = useAuth();

  // Para estructura personalizada de @mui
  const [fieldError, setFieldError] = useState<string | null>(null);

  // Para excluir otros símbolos especiales
  const validPlanName = /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ\s]+$/;

  // Para crear los semestres vacíos y el estado inicial del Plan académico
  const makeEmptySemesters = (count: number) =>
    Array.from({ length: count }, (_, i) => ({
      semesterNumber: i + 1,
      courses: [] as CourseDto[],
    }));

  const [plan, setPlan] = useState<Pensum>({
    _id: "",
    name: "",
    description: "",
    totalSemesters: semestresTotales,
    semesters: makeEmptySemesters(semestresTotales),
    userId: ""
  });

  const handleSelectPlanAnterior = (value: string) => {
    setPlanAnterior(value);

    if (value !== "No") {
      const base = pensums?.find(p => p._id === value);
      if (base) {
        // clonar estructura pero limpiar id
        setPlan({
          ...base,
          _id: "",
          name: "", // forzar a que el usuario escriba uno nuevo
        });
        setPlanName("");
        setSemestresTotales(base.totalSemesters);
        setSemestreActual(1);
      }
    } else {
      // plan vacío
      setPlan({
        _id: "",
        name: "",
        totalSemesters: semestresTotales,
        semesters: makeEmptySemesters(semestresTotales),
        userId: ""
      });
      setPlanName("");
      setSemestreActual(1);
    }
  };

  // Validaciones
  const validatePlan = () => {
    if (!plan.name.trim()) {
      alert("El nombre del plan no puede estar vacío.");
      return false;
    }

    for (const s of plan.semesters) {
      if (s.courses.length < 5) {
        alert(`El semestre ${s.semesterNumber} tiene menos de 5 asignaturas.`);
        return false;
      }
    }

    return true;
  };

  // Handlers
  const handleAdd = (newCourse: CourseDto) => {
    if (!newCourse.name.trim()) {
      alert("El nombre del curso no puede estar vacío.");
      return;
    }

    setPlan(prev => ({
      ...prev,
      semesters: prev.semesters.map(s =>
        s.semesterNumber === semestreActual
          ? { ...s, courses: [...s.courses, newCourse] }
          : s
      ),
    }));
  };

  const handleDelete = (index: number) => {
    setPlan(prev => ({
      ...prev,
      semesters: prev.semesters.map(s =>
        s.semesterNumber === semestreActual
          ? {
            ...s,
            courses: s.courses.filter((_, i) => i !== index),
          }
          : s
      ),
    }));
  };

  const handleUpdate = (index: number, updated: CourseDto) => {
    setPlan(prev => ({
      ...prev,
      semesters: prev.semesters.map(s =>
        s.semesterNumber === semestreActual
          ? {
            ...s,
            courses: s.courses.map((c, i) => (i === index ? updated : c)),
          }
          : s
      ),
    }));
  };

  const handleNameChange = (value: string) => {
    // Validar cada vez que cambia
    if (value && !validPlanName.test(value)) {
      alert("El nombre del plan contiene caracteres no permitidos.");
      setFieldError("El nombre del plan contiene caracteres no permitidos.");
    } else {
      setFieldError(null);
    }

    setPlanName(value);
    setPlan(prev => ({ ...prev, name: value }));
  };

  const handleTotalSemestersChange = (count: number) => {
    setSemestresTotales(count);
    setPlan(prev => {
      const nextSemesters = Array.from({ length: count }, (_, i) => {
        const semesterNumber = i + 1;
        const existing = prev.semesters.find(s => s.semesterNumber === semesterNumber);
        return {
          semesterNumber,
          courses: existing?.courses ?? [],
        };
      });
      return { ...prev, totalSemesters: count, semesters: nextSemesters };
    });
    if (semestreActual > count) setSemestreActual(count);
  };

  const handleSubmitPlan = async () => {
    if (!validatePlan()) return;

    try {
      const body = {
        name: plan.name,
        description: plan.description,
        totalSemesters: plan.totalSemesters,
        semesters: plan.semesters,
        userId: user._id
      };
      const created = await createPensum(body);
      console.log("Creado:", created);
      alert("Plan creado exitosamente!");

      // reset de información
      setPlanName("");
      setSemestreActual(1);
      setSemestresTotales(9);
      setPlan({
        _id: "",
        name: "",
        description: "",
        totalSemesters: 9,
        semesters: makeEmptySemesters(9),
        userId: ""
      });
      onClose();
    } catch (e: any) {
      alert(`Error al crear: ${e?.message ?? e}`);
    }
  };

  return (
    <Box sx={{ p: 3, flexGrow: 2 }}>
      <Typography variant="h5" gutterBottom>
        Añadir Plan de Estudio
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            label="Nombre del plan"
            value={planName}
            onChange={(e) => handleNameChange(e.target.value)}
            error={!!fieldError && fieldError.includes("plan")}
            helperText={fieldError && fieldError.includes("plan") ? fieldError : ""}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <FormControl fullWidth>
            <InputLabel>¿Utilizar plan anterior?</InputLabel>
            <Select
              value={planAnterior}
              onChange={(e) => handleSelectPlanAnterior(e.target.value)}
              label="¿Utilizar plan anterior?"
            >
              <MenuItem value="No">No</MenuItem>

              {
                loading && <MenuItem disabled><Typography>Cargando...</Typography></MenuItem>}

              {pensums?.map((p) => (
                <MenuItem key={p._id} value={p._id}>
                  {p.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
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
              semestre={semestresTotales}
              setSemestre={handleTotalSemestersChange}
              seleccion={semestreActual}
              setSeleccion={setSemestreActual}
            />
          </Box>
        </Grid>
      </Grid>

      <Grid sx={{xs:12,md:12}}>
        <TextField
          fullWidth
          multiline
          minRows={3}
          inputProps={{ maxLength: 50 }}
          helperText={`${plan.description?.length ?? 0}/50 caracteres`}
          label="Descripción"
          value={plan.description}
          onChange={(e) => setPlan((prev) => ({ ...prev, description: e.target.value }))}
        />
      </Grid>

      {/* Cursos del semestre seleccionado */}
      <CustomTextbox
        planName={plan.name}
        semestre={semestreActual}
        asignaturas={
          plan.semesters.find((s) => s.semesterNumber === semestreActual)?.courses || []
        }
        onAdd={handleAdd}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />

      <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleSubmitPlan}>
          Añadir
        </Button>
      </Box>
    </Box>
  )
};