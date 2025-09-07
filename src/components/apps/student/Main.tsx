import { Select, MenuItem, FormControl, InputLabel, Box, Typography, TextField, Paper, List, ListItemButton } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { usePensums } from "../../../hooks/usePensums";
import { useDeselect } from "../../../hooks/useDeselect";
import CourseCard from "./courses/CourseCard";
import { useNavigate } from "react-router-dom";
import { slugify } from "../../../utils/slugify";

export default function Main() {
  const [semestreSeleccionado, setSemestreSeleccionado] = useState<number | "">("");
  const [asignaturaSeleccionada, setAsignaturaSeleccionada] = useState("");
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);

  const navigate = useNavigate();
  const { data, loading, error } = usePensums();
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useDeselect(wrapperRef, () => setMostrarSugerencias(false));

  const latest = data.length > 0 ? data[data.length - 1]._id : null;
  const [planSeleccionado, setPlanSeleccionado] = useState<string | null>(latest);

  useEffect(() => {
    if (data.length > 0 && !planSeleccionado) {
      setPlanSeleccionado(data[data.length - 1]._id);
    }
  }, [data, planSeleccionado]);

  if (loading) return <Typography>Cargando...</Typography>;
  if (error) return <Typography style={{ color: "red" }}>Error: {error}</Typography>;

  const asignaturasFiltradas = data
    .filter((p) => p._id === planSeleccionado)
    .flatMap((p) =>
      p.semesters.flatMap((s) =>
        s.courses.map((c) => ({
          ...c,
          semesterNumber: s.semesterNumber,
          planId: p._id,
          planName: p.name,
          type: c.type
        }))
      )
    )
    .filter((c) => (semestreSeleccionado !== "" ? c.semesterNumber === semestreSeleccionado : true))
    .filter((c) =>
      asignaturaSeleccionada
        ? c.name.toLowerCase().includes(asignaturaSeleccionada.toLowerCase())
        : true
    );

  const sugerencias = [
  ...new Set(
    data
      .filter((p) => p._id === planSeleccionado)
      .flatMap((p) =>
        p.semesters.flatMap((s) => s.courses.map((c) => c.name))
      )
      .filter((name) =>
        asignaturaSeleccionada
          ? name.toLowerCase().includes(asignaturaSeleccionada.toLowerCase())
          : false
      )
  ),
].slice(0, 10);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Filtro de plan */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <FormControl fullWidth>
          <InputLabel>Plan</InputLabel>
          <Select
            value={planSeleccionado ?? ""}
            label="Plan"
            onChange={(e) => setPlanSeleccionado(e.target.value)}
          >
            {data.map((p) => (
              <MenuItem key={p._id} value={p._id}>
                {p.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Filtro de semestre */}
        <FormControl fullWidth>
          <InputLabel>Semestre</InputLabel>
          <Select
            value={semestreSeleccionado}
            label="Semestre"
            onChange={(e) => setSemestreSeleccionado(e.target.value)}
          >
            <MenuItem value="">Todos los semestres</MenuItem>
            {[...new Set(
              data
                .find((p) => p._id === planSeleccionado)
                ?.semesters.map((s) => s.semesterNumber) ?? []
            )]
              .sort()
              .map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Box>

      {/* Campo de texto con sugerencias */}
      <Box sx={{ position: "relative" }} ref={wrapperRef}>
        <TextField
          label="Asignatura"
          value={asignaturaSeleccionada}
          onChange={(e) => {
            setAsignaturaSeleccionada(e.target.value);
            setMostrarSugerencias(true);
          }}
          onFocus={() => setMostrarSugerencias(true)}
          fullWidth
        />
        {mostrarSugerencias && sugerencias.length > 0 && (
          <Paper
            sx={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              zIndex: 10,
              maxHeight: 200,
              overflowY: "auto",
            }}
          >
            <List>
              {sugerencias.map((s, i) => (
                <ListItemButton
                  sx={{ fontSize: 16 }}
                  key={i}
                  onClick={() => {
                    setAsignaturaSeleccionada(s);
                    setMostrarSugerencias(false);
                  }}
                >
                  {s}
                </ListItemButton>
              ))}
            </List>
          </Paper>
        )}
      </Box>

      {/* Lista de asignaturas */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: 2,
        }}
      >
        {asignaturasFiltradas.map((c, i) => (
          <CourseCard
            key={i}
            name={c.name}
            semesterNumber={c.semesterNumber}
            planId={c.planId}
            planName={c.planName}
            type={c.type}
            onClick={() =>
              navigate(
                `/student/${encodeURIComponent(c.planId)}/${slugify(c.name)}`
              )
            }
          />
        ))}
      </Box>
    </Box>
  );
}
