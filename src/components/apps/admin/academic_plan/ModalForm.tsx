import {
  Box,
  Typography,
  Button,
  Modal,
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@mui/material";
import type { CourseDto } from "../../../../models/types"; // usamos el modelo real del API

interface ModalFormProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  temp: CourseDto | null;
  setTemp: React.Dispatch<React.SetStateAction<CourseDto | null>>;
  title: string;
  subtitle?: string;
}

export default function ModalForm({
  open,
  onClose,
  onConfirm,
  temp,
  setTemp,
  title,
  subtitle,
}: ModalFormProps) {
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
          value={temp?.name || ""}
          onChange={(e) =>
            setTemp((prev) => (prev ? { ...prev, name: e.target.value } : null))
          }
        />

        <RadioGroup
          value={temp?.type || ""}
          onChange={(e) =>
            setTemp((prev) => (prev ? { ...prev, type: e.target.value as "B" | "E" } : null))
          }
        >
          <FormControlLabel value="B" control={<Radio />} label="Básica" />
          <FormControlLabel value="E" control={<Radio />} label="Electiva" />
        </RadioGroup>

        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
          <Button onClick={onClose}>Cancelar</Button>
          <Button variant="contained" onClick={onConfirm}>
            Confirmar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
