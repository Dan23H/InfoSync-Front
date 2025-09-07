import { Box, Typography, Button, Modal, TextField, RadioGroup, Radio, FormControlLabel } from "@mui/material";
import type { ModalFormProps } from "../../../../models/types";

export default function ModalForm({ open, onClose, onConfirm, temp, setTemp, title, subtitle }: ModalFormProps) {
  const handleNameChange = (value: string) => {
    setTemp((prev) =>
      prev ? { ...prev, name: value } : { name: value, type: "B" }
    );
  };

  const handleTypeChange = (value: "B" | "E") => {
    setTemp((prev) =>
      prev ? { ...prev, type: value } : { name: "", type: value }
    );
  };

  return (
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

        <TextField
          label="Nombre"
          value={temp?.name ?? ""}
          onChange={(e) => handleNameChange(e.target.value)}
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
            onClick={onConfirm}
            disabled={!temp?.name?.trim()}
          >
            Confirmar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
