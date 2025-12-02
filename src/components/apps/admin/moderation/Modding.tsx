import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { deleteReport, getReports, resolveReport } from "../../../../api/report";
import { useAuth } from "../../../../context/AuthContext";
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

  const { user } = useAuth();

  const handleViewContent = async (report: any) => {
    let content = null;
    if (report.targetType === "post") {
      content = await getPostById(report.targetId);
    } else if (report.targetType === "comment") {
      content = await getCommentById(report.targetId);
    } else if (report.targetType === "subcomment") {
      // If the report includes the parent comment id (commentId) use it to fetch the comment
      if (report.commentId) {
        const parent = await getCommentById(report.commentId);
        const found = parent?.subComments?.find((sc) => sc._id === report.targetId) || null;
        if (found) {
          // Enrich the subcomment with parent/post metadata so modal and moderation actions can use it
          // parent.postId should exist on the parent comment
          let pensumId: string | undefined = undefined;
          let course: string | undefined = undefined;
          try {
            const post = await getPostById(parent.postId);
            pensumId = post?.pensumId;
            course = post?.course;
          } catch (err) {
            // ignore post fetch errors; enrichment is best-effort
          }
          content = {
            ...found,
            commentId: parent._id,
            postId: parent.postId,
            pensumId,
            course
          };
        } else {
          content = null;
        }
      } else {
        // Fallback: try to fetch by targetId (may fail if API expects comment ids)
        try {
          const maybeParent = await getCommentById(report.targetId);
          content = maybeParent?.subComments?.find((sc) => sc._id === report.targetId) || null;
        } catch (err) {
          // Could not locate parent comment — leave content null
          content = null;
        }
      }
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
        const currentUserId = user?.userId || user?._id || "";
        if (modalReport.targetType === "post") {
          await deletePost(modalContent._id, currentUserId);
          const comments = await getComments(modalContent._id);
          for (const comment of comments) {
            if (comment.subComments && comment.subComments.length > 0) {
              for (const sub of comment.subComments) {
                await deleteSubComment(comment._id, sub._id, currentUserId);
              }
            }
            await deleteComment(comment._id, currentUserId);
          }
        } else if (modalReport.targetType === "comment") {
          if (modalContent.subComments && modalContent.subComments.length > 0) {
            for (const sub of modalContent.subComments) {
              await deleteSubComment(modalContent._id, sub._id, currentUserId);
            }
          }
          await deleteComment(modalContent._id, currentUserId);
        } else if (modalReport.targetType === "subcomment") {
          await deleteSubComment(modalContent.commentId, modalContent._id, currentUserId);
        }
      }
      if (moderation.banUser && modalContent?.userId) {
        await updateUserStatus(modalContent.userId, "banned");
      }
      const currentUserId = user?.userId || user?._id || "";
      await resolveReport(modalReport._id, {
        userId: currentUserId,
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
      const currentUserId = user?.userId || user?._id || "";
      await resolveReport(modalReport._id, {
        state: "Dismissed",
        userId: currentUserId,
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

  const handleDeleteReport = async (reportId: string) => {
    if (!window.confirm("¿Seguro que quieres borrar este reporte?")) return;
    try {
      const { user } = useAuth();
      if (!user) {
        alert("No autorizado. Inicia sesión de nuevo.");
        return;
      }
      const currentUserId = user.userId || user._id;
      await deleteReport(reportId, currentUserId);
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
        <Typography variant="body1" sx={{ mr: 2, alignSelf: "center", userSelect: "none" }}>
          Filtro:
        </Typography>
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
        <Typography sx={{ textAlign: "center", mt: 4, color: "text.secondary", userSelect: "none"  }}>
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
