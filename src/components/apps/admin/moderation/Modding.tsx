import { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, Button, CircularProgress, Chip, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { getReports } from "../../../../api/report";
import { getPostById } from "../../../../api/post";
import { getCommentById } from "../../../../api";
import { getUserById } from "../../../../api/user"; // Asegúrate de tener este endpoint
import { useNavigate } from "react-router-dom";
import { slugify } from "../../../../utils/slugify";

interface Report {
  _id: string;
  userId: string;
  targetType: "post" | "comment" | "subcomment";
  targetId: string;
  reason: string | string[];
  createdAt: string;
  solution?: any;
}

export default function Modding() {
  const [reports, setReports] = useState<Report[]>([]);
  const [authors, setAuthors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<any>(null);
  const [modalReport, setModalReport] = useState<Report | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getReports();
        setReports(data);

        // Obtén los nombres de los autores
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

  const handleViewContent = async (report: Report) => {
    let content = null;
    if (report.targetType === "post") {
      content = await getPostById(report.targetId);
    } else if (report.targetType === "comment") {
      content = await getCommentById(report.targetId);}
    // } else if (report.targetType === "subcomment") {
    //   content = await getSubCommentById(report.targetId);
    // }
    setModalContent(content);
    setModalReport(report);
    setModalOpen(true);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (reports.length === 0) {
    return <Typography>No hay reportes pendientes 🎉</Typography>;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {reports.map((r) => (
        <Card key={r._id} sx={{ border: "1px solid #ccc", borderRadius: 2 }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">
              Reportado por: <b>{authors[r.userId] || r.userId}</b> – {new Date(r.createdAt).toLocaleString()}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Tipo: {r.targetType} ({r.targetId})
            </Typography>
            <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
              {(Array.isArray(r.reason) ? r.reason : [r.reason]).map((reason, idx) => (
                <Chip key={idx} label={reason} color="error" size="small" />
              ))}
            </Box>
            <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
              <Button variant="contained" size="small" color="primary" onClick={() => handleViewContent(r)}>
                Ver contenido
              </Button>
              {r.solution ? (
                <Chip label="Atendido" color="success" size="small" />
              ) : null}
            </Box>
          </CardContent>
        </Card>
      ))}

      {/* Modal para mostrar el contenido reportado */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Contenido reportado</DialogTitle>
        <DialogContent>
          {modalContent ? (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Tipo: {modalReport?.targetType}
              </Typography>
              <pre style={{ background: "#f5f5f5", padding: 8, borderRadius: 4, fontSize: "0.95em", maxHeight: 300, overflow: "auto" }}>
                {JSON.stringify(modalContent, null, 2)}
              </pre>
            </Box>
          ) : (
            <Typography>Cargando contenido...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              if (!modalReport) return;
              // Redirige al post original
              if (modalReport.targetType === "post") {
                navigate(`/student/${modalContent.pensumId}/${slugify(modalContent.course)}/${modalContent._id}`);
              } else if (modalReport.targetType === "comment" || modalReport.targetType === "subcomment") {
                // Redirige al post relacionado
                navigate(`/student/${modalContent.pensumId}/${slugify(modalContent.course)}/${modalContent.postId}`);
              }
            }}
          >
            Ver más
          </Button>
          <Button onClick={() => setModalOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
