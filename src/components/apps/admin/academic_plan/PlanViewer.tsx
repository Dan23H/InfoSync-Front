import { useState } from "react";
import { Box, List, ListItemButton, ListItemText, useTheme } from "@mui/material";
import AddPlan from "./AddPlan";
import EditPlan from "./EditPlan";
import PensumList from "./PensumList";

export default function PlansViewer() {
  const [section, setSection] = useState<"list" | "add" | "edit">("list");
  const [currentId, setCurrentId] = useState<string | null>(null);
  const theme = useTheme();

  const handleEdit = (id: string) => {
    setCurrentId(id);
    setSection("edit");
  };

  return (
    <Box display="flex" gap={2}>
      <List sx={{ minWidth: 220, borderRight: `2px solid ${theme.palette.divider}` }}>
        {[
          { key: "list", label: "Lista de planes" },
          { key: "add", label: "Añadir plan" },
          { key: "edit", label: "Editar plan", requireId: true },
        ].filter((item) => !(item.requireId && !currentId)) // oculta "edit" si no hay id
          .map((item) => (
            <ListItemButton
              key={item.key}
              selected={section === item.key}
              onClick={() => setSection(item.key as typeof section)}
              sx={{
                "&.Mui-selected": {
                  color: theme.palette.primary.main,
                },
              }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
      </List>

      <Box flex={1} p={2}>
        {section === "list" && <PensumList onEdit={handleEdit} />}
        {section === "add" && <AddPlan onClose={() => { setSection("list") }} />}
        {section === "edit" && <EditPlan id={currentId} onClose={() => {
          setCurrentId(null);
          setSection("list");
        }} />}
      </Box>
    </Box>
  );
}