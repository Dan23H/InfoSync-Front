import { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import ModalForm from "./ModalForm";
import type { CustomTextbox, CourseDto } from "../../../../models";

export default function CustomTextbox({ planName, semestre, asignaturas, onAdd, onDelete, onUpdate, }: CustomTextbox) {
  const [modalState, setModalState] = useState<{
    open: boolean;
    index: number | null;
    subject: CourseDto | null;
  }>({ open: false, index: null, subject: null });

  const openEdit = (index: number) =>
    setModalState({ open: true, index, subject: asignaturas[index] });

  const openAdd = () =>
    setModalState({ open: true, index: null, subject: { name: "", type: "B" } });

  const closeModal = () =>
    setModalState({ open: false, index: null, subject: null });

  const handleConfirm = () => {
    if (modalState.subject) {
      if (modalState.index !== null) {
        onUpdate(modalState.index, modalState.subject);
      } else {
        onAdd(modalState.subject);
      }
    }
    closeModal();
  };

  const typeLabels = { B: "Básica", E: "Electiva" } as const;

  return (
    <Box sx={{ mt: 2, border: "1px solid #ccc", borderRadius: 2, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Asignaturas
      </Typography>

      {asignaturas.map((s, i) => (
        <Box
          key={s.name || i}
          sx={{
            borderBottom: "1px solid #eee",
            py: 1,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography>
            {s.name} | Clasificación: {typeLabels[s.type]} | Semestre: {semestre} | Plan: {planName}
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="text" color="primary" onClick={() => openEdit(i)}>
              Editar
            </Button>
            <Button variant="text" color="error" onClick={() => onDelete(i)}>
              Borrar
            </Button>
          </Box>
        </Box>
      ))}

      <Box sx={{ mt: 2 }}>
        <Button variant="outlined" onClick={openAdd}>
          Añadir Asignatura
        </Button>
      </Box>

      <ModalForm
        open={modalState.open}
        onClose={closeModal}
        onConfirm={handleConfirm}
        temp={modalState.subject}
        setTemp={(updater) =>
          setModalState((prev) => ({
            ...prev,
            subject: typeof updater === "function" ? updater(prev.subject) : updater,
          }))
        }
        title={modalState.index !== null ? "Editar Asignatura" : "Añadir Asignatura"}
        subtitle={`Semestre ${semestre} | ${planName}`}
      />
    </Box>
  );
}
