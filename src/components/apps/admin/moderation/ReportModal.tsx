import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Box, Chip, Button, FormControlLabel, Checkbox, TextField, Stack, Divider } from "@mui/material";
import PostCard from "../../student/posts/PostCard";
import CommentItem from "../../student/comments/CommentItem";
import SubCommentItem from "../../student/comments/SubcommentItem";
import type { ReportModalProps } from "../../../../models";
import { useNavigate } from "react-router-dom";

export default function ReportModal({
    open,
    modalReport,
    modalContent,
    moderation,
    setModeration,
    reviewDescription,
    setReviewDescription,
    actionLoading,
    onResolve,
    onDismiss,
    onClose
}: ReportModalProps) {
    const navigate = useNavigate();
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 4,
                    boxShadow: 6,
                    bgcolor: "#fafbfc"
                }
            }}
        >
            <DialogTitle sx={{ fontWeight: 700, color: "primary.main", pb: 0 }}>
                Contenido reportado
                <Divider sx={{ my: 1 }} />
            </DialogTitle>
            <DialogContent sx={{ pt: 1 }}>
                {modalContent ? (
                    <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: "text.secondary" }}>
                            Tipo: {modalReport?.targetType}
                        </Typography>
                        {modalContent.course && (
                            <Typography variant="body2" sx={{ mb: 1, color: "secondary.main", fontWeight: 500 }}>
                                Curso: {modalContent.course}
                            </Typography>
                        )}
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ fontWeight: 500, color: "text.secondary" }}>
                                Razón del reporte:
                            </Typography>
                            {(Array.isArray(modalReport?.reason) ? modalReport?.reason : [modalReport?.reason]).map((reason, idx) => (
                                <Chip
                                    key={idx}
                                    label={reason}
                                    color="error"
                                    size="small"
                                    sx={{
                                        bgcolor: "#ffeaea",
                                        color: "#d32f2f",
                                        fontWeight: 500,
                                        px: 1
                                    }}
                                />
                            ))}
                        </Stack>
                        <Box sx={{ userSelect: "none", mb: 2 }}>
                            {modalReport?.targetType === "post" && (
                                <PostCard post={modalContent} currentUserId={modalContent.userId} />
                            )}
                            {modalReport?.targetType === "comment" && (
                                <CommentItem comment={modalContent} onAddSubComment={() => { }} />
                            )}
                            {modalReport?.targetType === "subcomment" && (
                                <SubCommentItem subComment={modalContent} />
                            )}
                        </Box>
                        <Box sx={{
                            mt: 2,
                            p: 2,
                            borderRadius: 3,
                            bgcolor: "#f5f5f7",
                            boxShadow: 1
                        }}>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: "primary.main" }}>
                                Moderación
                            </Typography>
                            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={moderation.deleteContent}
                                            onChange={e => setModeration(m => ({ ...m, deleteContent: e.target.checked }))}
                                            sx={{ color: "error.main" }}
                                        />
                                    }
                                    label={
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                            {/* <BlockIcon fontSize="small" color="error" /> */}
                                            <span>Eliminar contenido</span>
                                        </Box>
                                    }
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={moderation.banUser}
                                            onChange={e => setModeration(m => ({ ...m, banUser: e.target.checked }))}
                                            sx={{ color: "warning.main" }}
                                        />
                                    }
                                    label={
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                            {/* <WarningAmberIcon fontSize="small" color="warning" /> */}
                                            <span>Banear usuario</span>
                                        </Box>
                                    }
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={moderation.warnUser}
                                            onChange={e => setModeration(m => ({ ...m, warnUser: e.target.checked }))}
                                            sx={{ color: "rgba(255, 150, 50, 1)", '&.Mui-checked': { color: "rgba(255, 150, 50, 1)" } }}
                                        />
                                    }
                                    label={
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                            {/* <WarningAmberIcon fontSize="small" color="info" /> */}
                                            <span>Advertir usuario</span>
                                        </Box>
                                    }
                                />
                            </Stack>
                            <TextField
                                label="Descripción de la revisión"
                                multiline
                                minRows={2}
                                fullWidth
                                sx={{ mt: 1 }}
                                value={reviewDescription}
                                onChange={e => setReviewDescription(e.target.value)}
                                variant="outlined"
                            />
                        </Box>
                    </Box>
                ) : (
                    <Typography>Cargando contenido...</Typography>
                )}
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
                <Box sx={{ flexGrow: 1 }}>
                    <Button
                        variant="contained"
                        color="error"
                        // startIcon={<VisibilityIcon />}
                        onClick={() => {
                            if (!modalReport || !modalContent) return;
                            let url = "";
                            if (modalReport.targetType === "post") {
                                url = `/student/${modalContent.pensumId}/${modalContent.course}/${modalContent._id}`;
                            } else if (modalReport.targetType === "comment" || modalReport.targetType === "subcomment") {
                                url = `/student/${modalContent.pensumId}/${modalContent.course}/${modalContent.postId}`;
                            }
                            navigate(url);
                        }}
                    >
                        Ver más
                    </Button>
                </Box>
                <Box sx={{ flexGrow: 0, display: "flex", gap: 1 }}>
                    <Button
                        variant="contained"
                        color="success"
                        // startIcon={<CheckCircleIcon />}
                        disabled={actionLoading}
                        onClick={onResolve}
                    >
                        Resolver
                    </Button>
                    <Button
                        variant="contained"
                        color="warning"
                        // startIcon={<BlockIcon />}
                        disabled={actionLoading}
                        onClick={onDismiss}
                    >
                        Desestimar
                    </Button>
                    <Button
                        variant="outlined"
                        color="inherit"
                        // startIcon={<CloseIcon />}
                        onClick={onClose}
                    >
                        Cerrar
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
}