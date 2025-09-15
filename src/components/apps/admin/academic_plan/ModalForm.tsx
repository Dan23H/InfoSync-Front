import { Box, Typography, Button, Modal, TextField, RadioGroup, Radio, FormControlLabel } from "@mui/material";
import type { ModalFormProps } from "../../../../models/types";
import { useState } from "react";

export default function ModalForm({ open, onClose, onConfirm, temp, setTemp, title, subtitle }: ModalFormProps) {
  const validCourseName = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s0-9]+$/;

  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  const handleNameChange = (value: string) => {
    setTemp((prev) =>
      prev ? { ...prev, name: value } : { name: value, type: "B" }
    );
    if (error) setError(null); // limpiar error mientras escribe
  };

  const handleNameBlur = () => {
    const value = temp?.name?.trim() ?? "";
    let errorMessage: string | null = null;

    switch (true) {
      case !value:
        errorMessage = "El nombre no puede estar vacío.";
        break;

      case value.length < 4:
        errorMessage = "El nombre debe tener al menos 4 caracteres.";
        break;

      case /^\d+$/.test(value):
        errorMessage = "El nombre no puede estar compuesto solo por números.";
        break;

      case !validCourseName.test(value):
        errorMessage = "Solo se permiten letras, números, tildes y espacios.";
        break;

      default:
        errorMessage = null;
    }

    setError(errorMessage);

    if (errorMessage) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleTypeChange = (value: "B" | "E") => {
    setTemp((prev) =>
      prev ? { ...prev, type: value } : { name: "", type: value }
    );
  };

  const handleConfirm = () => {
    onConfirm(); // lógica externa (guardar en BD, etc.)
    onClose();   // cerrar el modal principal
  };

  return (
    <>
      {/* Modal principal */}
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            p: 4,
            backgroundColor: "white",
            borderRadius: 2,
            width: 400,
            mx: "auto",
            mt: "20vh",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h6">{title}</Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}

          {error && (
            <Typography color="error" variant="caption">
              {error}
            </Typography>
          )}

          <TextField
            label="Nombre"
            value={temp?.name ?? ""}
            onChange={(e) => handleNameChange(e.target.value)}
            onBlur={handleNameBlur}
            error={!!error}
            sx={{
              animation: shake ? "shake 0.3s" : "none",
              "@keyframes shake": {
                "0%": { transform: "translateX(0)" },
                "25%": { transform: "translateX(-5px)" },
                "50%": { transform: "translateX(5px)" },
                "75%": { transform: "translateX(-5px)" },
                "100%": { transform: "translateX(0)" },
              },
            }}
          />

          <RadioGroup
            value={temp?.type ?? "B"}
            onChange={(e) => handleTypeChange(e.target.value as "B" | "E")}
          >
            <FormControlLabel value="B" control={<Radio />} label="Básica" />
            <FormControlLabel value="E" control={<Radio />} label="Electiva" />
          </RadioGroup>

          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button onClick={onClose}>Cancelar</Button>
            <Button
              variant="contained"
              onClick={handleConfirm}
              disabled={!temp?.name?.trim() || !!error}
            >
              Confirmar
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
