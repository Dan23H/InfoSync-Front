import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { deleteReport, getReports, resolveReport } from "../../../../api/report";
import { getUserById, updateUserStatus } from "../../../../api/user";
import ReportList from "./ReportList";
import ReportModal from "./ReportModal";
import { deleteComment, deletePost, deleteSubComment, getCommentById, getComments, getPostById } from "../../../../api";

export default function Modding() {
  const [reports, setReports] = useState<any[]>([]);
  const [authors, setAuthors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<any>(null);
  const [modalReport, setModalReport] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [moderation, setModeration] = useState({ deleteContent: false, banUser: false, warnUser: false });
  const [reviewDescription, setReviewDescription] = useState("");
  const [filter, setFilter] = useState<"Pending" | "Resolved">("Pending");

  // Opciones de filtro
  const FILTERS = [
    { value: "Pending", label: "Pendientes", color: "#ffeaea" },
    { value: "Resolved", label: "Resueltos", color: "#f5f5f5" }
  ];

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getReports();
        setReports(data);

        // Nombres de los autores
        const uniqueUserIds = [...new Set(data.map(r => r.userId))];
        const authorMap: Record<string, string> = {};
        await Promise.all(uniqueUserIds.map(async (id) => {
          try {
            const user = await getUserById(id);
            authorMap[id] = user.userName;
          } catch {
            authorMap[id] = id;
          }
        }));
        setAuthors(authorMap);
      } catch (err) {
        console.error("Error cargando reportes", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleViewContent = async (report: any) => {
    let content = null;
    if (report.targetType === "post") {
      content = await getPostById(report.targetId);
    } else if (report.targetType === "comment") {
      content = await getCommentById(report.targetId);
    } else if (report.targetType === "subcomment") {
      let comment = await getCommentById(report.targetId);
      content = comment?.subComments?.find((sc) => sc._id === report.targetId) || null;
    }
    setModalContent(content);
    setModalReport(report);
    setModalOpen(true);
  };

  const handleResolveReport = async () => {
    if (!modalReport) return;
    setActionLoading(true);
    try {
      // MEDIDA TEMPORAL: Eliminación en cascada desde el frontend
      if (moderation.deleteContent && modalContent) {
        if (modalReport.targetType === "post") {
          await deletePost(modalContent._id, modalContent.userId);
          const comments = await getComments(modalContent._id);
          for (const comment of comments) {
            if (comment.subComments && comment.subComments.length > 0) {
              for (const sub of comment.subComments) {
                await deleteSubComment(comment._id, sub._id, sub.userId);
              }
            }
            await deleteComment(comment._id, comment.userId);
          }
        } else if (modalReport.targetType === "comment") {
          if (modalContent.subComments && modalContent.subComments.length > 0) {
            for (const sub of modalContent.subComments) {
              await deleteSubComment(modalContent._id, sub._id, sub.userId);
            }
          }
          await deleteComment(modalContent._id, modalContent.userId);
        } else if (modalReport.targetType === "subcomment") {
          await deleteSubComment(modalContent.commentId, modalContent._id, modalContent.userId);
        }
      }
      if (moderation.banUser && modalContent?.userId) {
        await updateUserStatus(modalContent.userId, "banned");
      }
      await resolveReport(modalReport._id, {
        userId: modalReport.userId,
        state: "Resolved",
        reviewDescription: reviewDescription
      });
      alert("Reporte actualizado correctamente.");
      setModalOpen(false);
    } catch (err) {
      alert("Error al ejecutar acciones/moderar el reporte.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDismissReport = async () => {
    if (!modalReport) return;
    setActionLoading(true);
    try {
      await resolveReport(modalReport._id, {
        state: "Dismissed",
        userId: modalReport.userId,
        reviewDescription
      });
      alert("Reporte desestimado.");
      setModalOpen(false);
    } catch (err) {
      alert("Error al desestimar el reporte.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteReport = async (reportId: string, userId: string) => {
    if (!window.confirm("¿Seguro que quieres borrar este reporte?")) return;
    try {
      await deleteReport(reportId, userId);
      setReports(reports => reports.filter(r => r._id !== reportId));
      alert("Reporte borrado correctamente.");
    } catch (err) {
      alert("Error al borrar el reporte.");
    }
  };

  // Ordena los reportes del más reciente al más antiguo
  const sortedReports = [...reports].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Filtrado de reportes según el estado
  const filteredReports = sortedReports.filter(r => r.state === filter);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", mt: "45%" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Filtro de reportes como chip dividido */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Box sx={{
          display: "flex",
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: 1,
          border: "1px solid #eee",
        }}>
          {FILTERS.map(f => (
            <Box
              key={f.value}
              sx={{
                px: 2,
                py: 0.5,
                cursor: "pointer",
                bgcolor: filter === f.value ? f.color : "#f5f5f5",
                color: filter === f.value ? "#d32f2f" : "#888",
                borderRight: f.value === "Pending" ? "1px solid #eee" : "none",
                transition: "background 0.2s",
                userSelect: "none"
              }}
              onClick={() => setFilter(f.value as "Pending" | "Resolved")}
            >
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {f.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Lista de reportes filtrados */}
      {filteredReports.length === 0 ? (
        <Typography sx={{ textAlign: "center", mt: 4, color: "text.secondary" }}>
          {filter === "Pending"
            ? "No hay reportes pendientes!"
            : "No hay reportes resueltos."}
        </Typography>
      ) : (
        <ReportList
          reports={filteredReports}
          authors={authors}
          filter={filter}
          onView={handleViewContent}
          onDelete={handleDeleteReport}
        />
      )}

      {/* Modal para mostrar el contenido reportado */}
      <ReportModal
        open={modalOpen}
        modalReport={modalReport}
        modalContent={modalContent}
        moderation={moderation}
        setModeration={setModeration}
        reviewDescription={reviewDescription}
        setReviewDescription={setReviewDescription}
        actionLoading={actionLoading}
        onResolve={handleResolveReport}
        onDismiss={handleDismissReport}
        onClose={() => setModalOpen(false)}
      />
    </Box>
  );
}
