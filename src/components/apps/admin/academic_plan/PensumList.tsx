import { Box, Typography } from "@mui/material";
import { usePensums } from "../../../../hooks/usePensums";
import PensumCard from "./PensumCard";
import ErrorAlert from "../../../common/ErrorAlert";

interface PensumListProps {
  onEdit: (id: string) => void;
}

export default function PensumList({ onEdit }: PensumListProps) {
  const { data, loading, error, removePensum } = usePensums();

  const handleDelete = (id: string) => {
    if (window.confirm("¿Seguro que quieres eliminar este pensum?")) {
      removePensum(id);
    }
  };

  if (loading) return <Typography>Cargando...</Typography>;
  if (error) return <ErrorAlert
    message={error}
    actionLabel="Intentar de nuevo"
    onAction={() => error}
  />;

  return (
    <Box>
      {data.map((p) => (
        <PensumCard
          key={p._id}
          pensum={p}
          onEdit={onEdit}
          onDelete={handleDelete}
        />
      ))}
    </Box>
  );
}
