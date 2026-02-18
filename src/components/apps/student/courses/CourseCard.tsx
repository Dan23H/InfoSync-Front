import "../../../../styles/student-courses.css";
import { Box, Card, CardActionArea, CardContent, Typography } from "@mui/material";
import type { CourseCardProps } from "../../../../models";

export default function CourseCard({ name, semesterNumber, planName, type, onClick }: CourseCardProps) {
  return (
    <Card className="course-card">
      <CardActionArea onClick={onClick} style={{ height: "100%" }}>
        <CardContent style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", paddingTop: 8, paddingBottom: 16 }}>
          <Typography variant="body2" color="textSecondary" className="semester">
            Semestre: {semesterNumber}
          </Typography>

          <Typography variant="h6" gutterBottom>
            {name}
          </Typography>

          <Box style={{ marginTop: 8 }}>
            <Typography variant="body2" color="textSecondary" className="plan">
              Plan: {planName}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
      <Box className={`type-bar ${type === "B" ? "type-b" : "type-a"}`} />
    </Card>
  );
}