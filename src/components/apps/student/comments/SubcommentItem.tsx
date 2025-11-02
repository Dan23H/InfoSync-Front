import { Box, Typography, Avatar, IconButton, MenuItem, Dialog, DialogTitle, DialogContent, FormControl, InputLabel, Select, DialogActions, Button, Snackbar } from "@mui/material";
import type { SubComment } from "../../../../models";
import { useAuthor } from "../../../../hooks/useAuthor";
import { useState, useEffect } from "react";
import { createReport } from "../../../../api";
import { useSocket } from "../../../../context/SocketContext";

interface SubcommentItemProps {
  subComment: SubComment;
}

export default function SubCommentItem({ subComment }: SubcommentItemProps) {
  const { user: subAuthor, loading } = useAuthor(subComment.userId || null);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { onEvent, emitEvent } = useSocket();

  const REPORT_REASONS = [
    "Inappropriate",
    "Harassment",
    "Offensive",
    "Spam",
    "Misleading",
    "Copyright",
    "Impersonation",
    "Privacy",
  ];

  useEffect(() => {
    const handleSubCommentUpdate = (updatedSubComment: SubComment) => {
      if (updatedSubComment._id === subComment._id) {
        // Actualizar el estado local o forzar un re-render
        window.location.reload();
      }
    };

    onEvent("subcomment-updated", handleSubCommentUpdate);

    return () => {
      // Cleanup
      onEvent("subcomment-updated", () => {});
    };
  }, [subComment._id, onEvent]);

  const handleReportSubmit = async () => {
    await createReport({
      userId: subComment.userId, // O el usuario actual si lo tienes
      targetType: "subcomment",
      targetId: subComment._id,
      reason: reportReason,
    });
    emitEvent("subcomment-reported", { subCommentId: subComment._id, reason: reportReason });
    setReportDialogOpen(false);
    setReportReason("");
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{ mb: 1 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Avatar sx={{ width: 24, height: 24 }}>
          {subAuthor ? subAuthor.userName[0] : subComment.userId[0]}
        </Avatar>
        <Typography variant="subtitle2">
          {subAuthor ? subAuthor.userName : loading ? "Cargando..." : "Desconocido"}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {new Date(subComment.createdAt).toLocaleString()}
        </Typography>
      </Box>
      <Typography variant="body2" sx={{ ml: 4 }}>
        {subComment.commentary}
      </Typography>
      <IconButton
        size="small"
        onClick={() => {
            setReportDialogOpen(true);
          }}
        sx={{ ml: 1 }}
      >
        Reportar
      </IconButton>

      <Dialog open={reportDialogOpen} onClose={() => setReportDialogOpen(false)}>
        <DialogTitle>Reportar subcomentario</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel id="report-reason-label">Motivo</InputLabel>
            <Select
              labelId="report-reason-label"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
            >
              {REPORT_REASONS.map((reason) => (
                <MenuItem key={reason} value={reason}>
                  {reason}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReportDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleReportSubmit} disabled={!reportReason}>
            Enviar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        message="Reporte enviado correctamente"
        onClose={() => setSnackbarOpen(false)}
      />
    </Box>
  );
}
