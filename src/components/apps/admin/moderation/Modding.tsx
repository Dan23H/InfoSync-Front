import { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, Button, CircularProgress, Chip } from "@mui/material";
import { getReports } from "../../../../api";

interface Report {
  _id: string;
  userId: string;
  targetType: string;
  targetId: string;
  reason: string | string[];
  createdAt: string;
}       

export default function Modding() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getReports();
        setReports(data);
      } catch (err) {
        console.error("Error cargando reportes", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

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
              Reportado por: <b>{r.userId}</b> – {new Date(r.createdAt).toLocaleString()}
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
              <Button variant="contained" size="small" color="primary">
                Ver contenido
              </Button>
              <Button variant="outlined" size="small" color="success">
                Marcar como atendido
              </Button>
              <Button variant="outlined" size="small" color="error">
                Ignorar
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
