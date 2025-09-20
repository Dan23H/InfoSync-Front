import { Box, Card, CardActionArea, CardContent, Typography } from "@mui/material";
import type { CourseCardProps } from "../../../../models";

export default function CourseCard({ name, semesterNumber, planName, type, onClick }: CourseCardProps) {
  return (
    <Card sx={{ position:"relative", minHeight: 150, border:"1px solid rgba(0,0,0,0.2)", transition: "background-color 0.2s ease ", "&:hover": { backgroundColor: "rgba(0,0,0,0.1)" }}}>
      <CardActionArea onClick={onClick} sx={{ height: "100%" }}>
        <CardContent sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", pt: 1, pb: 2 }}>
          <Typography variant="body2" color="textSecondary" sx={{ position: "absolute", top: 8, right: 8 }}>
            Semestre: {semesterNumber}
          </Typography>

          <Typography variant="h6" gutterBottom>
            {name}
          </Typography>

          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="textSecondary" sx={{ position: "absolute", bottom: 8, left: 8 }}>
              Plan: {planName}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
      <Box sx={{ position: "absolute", bottom: 0, right: 0, left: 0, height: 4, bgcolor: type === "B" ? "orange" : "blue" }}
      />
    </Card>
  );
}