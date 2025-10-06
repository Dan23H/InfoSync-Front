import { Card, CardContent, Typography, Box, Chip, Button, Tooltip } from "@mui/material";
import { DeleteSVG } from "../../../../assets";
import type { ReportListProps } from "../../../../models";

export default function ReportList({ reports, authors, filter, onView, onDelete }: ReportListProps) {
    return (
        <>
            {reports.length === 0 ? (
                <Typography sx={{ textAlign: "center", mt: 4, color: "text.secondary" }}>
                    {filter === "Pending"
                        ? "No hay reportes pendientes!"
                        : "No hay reportes resueltos."}
                </Typography>
            ) : (
                reports.map((r) => (
                    <Card
                        key={r._id}
                        sx={{
                            borderRadius: 3,
                            boxShadow: 3,
                            border: "none",
                            mb: 3,
                            transition: "box-shadow 0.2s",
                            ":hover": { boxShadow: 6 }
                        }}
                    >
                        <CardContent>
                            <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600 }}>
                                Reportado por: <b>{authors[r.userId] || r.userId}</b> · {new Date(r.createdAt).toLocaleString()}
                            </Typography>
                            {r.state === "Resolved" && (
                                <Typography variant="body2" color="secondary" sx={{ mt: 0.5 }}>
                                    Resuelto por: <b>{r.reviewedBy}</b> · {new Date(r.resolvedAt || "").toLocaleString()}
                                </Typography>
                            )}
                            <Typography variant="body2" sx={{ mt: 1, fontWeight: 500 }}>
                                Tipo: {r.targetType} <span style={{ color: "#888" }}>({r.targetId})</span>
                            </Typography>
                            <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                    Razón del reporte:
                                </Typography>
                                {(Array.isArray(r.reason) ? r.reason : [r.reason]).map((reason, idx) => (
                                    <Chip
                                        key={idx}
                                        label={reason}
                                        color="error"
                                        size="small"
                                        sx={{ bgcolor: "#ffeaea", color: "#d32f2f", fontWeight: 500, mr: 0.5 }}
                                    />
                                ))}
                            </Box>
                            {r.course && (
                                <Typography variant="body2" sx={{ mt: 0.5, color: "text.secondary" }}>
                                    Curso: <b>{r.course}</b>
                                </Typography>
                            )}
                            <Box
                                sx={{
                                    mt: 2,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between"
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                    <Tooltip title="Ver contenido">
                                        <span>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                color="error"
                                                // startIcon={"VisibilityIcon"}
                                                onClick={() => onView(r)}
                                                disabled={r.state === "Resolved"}
                                                sx={{
                                                    boxShadow: 1,
                                                    textTransform: "none",
                                                    fontWeight: 500
                                                }}
                                            >
                                                Ver contenido
                                            </Button>
                                        </span>
                                    </Tooltip>
                                    {(r.state !== "Pending") ? (
                                        <Chip
                                            label={r.state === "Dismissed" ? "Desestimado" : "Atendido"}
                                            color={r.state === "Dismissed" ? "warning" : "success"}
                                            size="small"
                                            sx={{
                                                fontWeight: 600,
                                                letterSpacing: 0.5,
                                                px: 1.5
                                            }}
                                        />
                                    ) : null}
                                </Box>
                                <Tooltip title="Borrar reporte">
                                    <span>
                                        <Button
                                            variant="outlined"
                                            
                                            size="small"
                                            startIcon={<img src={DeleteSVG} alt="delete" style={{ width: 16, height: 16 }} />}
                                            onClick={() => onDelete(r._id, r.userId)}
                                            sx={{
                                                textTransform: "none",
                                                fontWeight: 500,
                                                borderRadius: 2,
                                                color: "darkgray",
                                                borderColor: "darkgray",
                                                ":hover": { bgcolor: "#ffeaea" }
                                            }}
                                        >
                                            Borrar
                                        </Button>
                                    </span>
                                </Tooltip>
                            </Box>
                        </CardContent>
                    </Card>
                ))
            )}
        </>
    );
}