import React, { useState } from "react";
import { Card, CardHeader, CardContent, IconButton, Typography, List, ListItem, ListItemText, Collapse, Grid, Box } from "@mui/material";
import type { PensumCardProps } from "../../../../models/types";
import { DeleteSVG, EditSVG } from "../../../../assets";

const PensumCard: React.FC<PensumCardProps> = ({ pensum, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <Card variant="outlined" sx={{ mt: 2, marginBottom: 2, cursor: "pointer", boxShadow:1 }} onClick={handleToggle}>
      <CardHeader
        title={pensum.name}
        subheader={`Total de semestres: ${pensum.totalSemesters}`}
        action={
          <>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onEdit(pensum._id);
              }}
            >
              <img src={EditSVG} alt="editar" width={20} height={20} />
            </IconButton>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onDelete(pensum._id);
              }}
            >
              <img src={DeleteSVG} alt="eliminar" width={20} height={20} />
            </IconButton>
          </>
        }
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Grid container spacing={2} alignItems="stretch">

            {pensum.semesters.map((semester) => (
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 3, xl:2}} key={semester.semesterNumber}>
                <Box sx={{ border: "1px solid #ddd", borderRadius: 1, p: 2, height: "95%", boxShadow:1 }}>
                  <Typography variant="h6" sx={{ mt: 1 }} gutterBottom>
                    Semestre {semester.semesterNumber}
                  </Typography>
                  <List>
                    {semester.courses.map((course) => (
                      <ListItem key={course.name} sx={{ pl: 4 }}>
                        <ListItemText
                          primary={course.name}
                          secondary={`Tipo: ${course.type}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default PensumCard;