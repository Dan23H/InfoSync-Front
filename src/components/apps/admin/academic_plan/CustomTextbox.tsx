import { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import ModalForm from "./ModalForm";
import type { CourseDto } from "../../../../models/types";

interface Props {
  planName: string;
  semestre: number;
  asignaturas: CourseDto[];
  onAdd: (newSubject: CourseDto) => void;
  onDelete: (index: number) => void;
  onUpdate: (index: number, updated: CourseDto) => void;
}

export default function CustomTextbox({
  planName,
  semestre,
  asignaturas,
  onAdd,
  onDelete,
  onUpdate,
}: Props) {
  const [openModal, setOpenModal] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [temp, setTemp] = useState<CourseDto | null>(null);

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setTemp(asignaturas[index]);
    setOpenModal(true);
  };

  const handleConfirm = () => {
    if (temp) {
      if (editIndex !== null) {
        onUpdate(editIndex, temp);
      } else {
        onAdd(temp);
      }
    }
    setOpenModal(false);
    setTemp(null);
    setEditIndex(null);
  };

  const handleOpenAdd = () => {
    setEditIndex(null);
    setTemp({ name: "", type: "B" }); // por defecto Básica
    setOpenModal(true);
  };

  const getTypeLabel = (t: "B" | "E") =>
    t === "B" ? "Básica" : "Electiva";

  return (
    <Box sx={{ mt: 2, border: "1px solid #ccc", borderRadius: 2, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Asignaturas
      </Typography>

      {asignaturas.map((s, i) => (
        <Box
          key={i}
          sx={{
            borderBottom: "1px solid #eee",
            py: 1,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography>
            {s.name} | Clasificación: {getTypeLabel(s.type)} | Semestre:{" "}
            {semestre} | Plan: {planName}
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="text" color="primary" onClick={() => handleEdit(i)}>
              Editar
            </Button>
            <Button variant="text" color="error" onClick={() => onDelete(i)}>
              Borrar
            </Button>
          </Box>
        </Box>
      ))}

      <Box sx={{ mt: 2 }}>
        <Button variant="outlined" onClick={handleOpenAdd}>
          Añadir Asignatura
        </Button>
      </Box>

      <ModalForm
        open={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={handleConfirm}
        temp={temp}
        setTemp={setTemp}
        title={editIndex !== null ? "Editar Asignatura" : "Añadir Asignatura"}
        subtitle={`Semestre ${semestre} | ${planName}`}
      />
    </Box>
  );
}
