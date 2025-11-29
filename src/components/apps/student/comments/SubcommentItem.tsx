import { Box, Typography, Avatar, IconButton, MenuItem, Dialog, DialogTitle, DialogContent, FormControl, InputLabel, Select, DialogActions, Button, Snackbar, Tooltip } from "@mui/material";
import { ReportSVG } from "../../../../assets";
import type { SubComment } from "../../../../models";
import { useAuthor } from "../../../../hooks/useAuthor";
import { useState } from "react";
import { createReport } from "../../../../api";

interface SubcommentItemProps {
  subComment: SubComment;
  parentCommentId?: string;
}

export default function SubCommentItem({ subComment, parentCommentId }: SubcommentItemProps) {
  const { user: subAuthor, loading } = useAuthor(subComment.userId || null);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

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

  const handleReportSubmit = async () => {
    const payload: any = {
      userId: subComment.userId, // O el usuario actual si lo tienes
      targetType: "subcomment",
      targetId: subComment._id,
      reason: reportReason,
    };
    if (parentCommentId) payload.commentId = parentCommentId;
    await createReport(payload);
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
        <Tooltip
          title="Reportar"
          placement="left"
        >
          <IconButton
            size="small"
            onClick={() => {
              setReportDialogOpen(true);
            }}
            sx={{ ml: "auto" }}
            aria-label="Reportar"
          >
            <img src={ReportSVG} alt="report" width={16} height={16} />
          </IconButton>
        </Tooltip>
      </Box>
      <Typography variant="body2" sx={{ ml: 4 }}>
        {subComment.commentary}
      </Typography>

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
