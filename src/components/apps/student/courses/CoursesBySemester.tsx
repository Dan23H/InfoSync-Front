import "../../../../styles/student-courses.css";
import { Box, Divider, Typography } from "@mui/material";
import CourseCard from "./CourseCard";
import { slugify } from "../../../../utils/slugify";
import { useNavigate } from "react-router-dom";

export default function CoursesBySemester({ groupedCourses }: any) {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {Object.keys(groupedCourses)
        .sort((a, b) => Number(a) - Number(b))
        .map((semestre) => (
          <Box key={semestre}>
            <Divider sx={{ mb: 2 }}>
              <Typography variant="h6">Semestre {semestre}</Typography>
            </Divider>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: 2,
              }}
            >
              {groupedCourses[semestre].map((c: any, i: number) => (
                <CourseCard
                  key={i}
                  name={c.name}
                  semesterNumber={c.semesterNumber}
                  planId={c.planId}
                  planName={c.planName}
                  type={c.type}
                  onClick={() =>
                    navigate(`/student/${encodeURIComponent(c.planId)}/${slugify(c.name)}`)
                  }
                />
              ))}
            </Box>
          </Box>
        ))}
    </Box>
  );
}
