import { useMemo } from "react";
import CourseSection from "./CourseSection";
import { Typography, Grid } from "@mui/material";

interface SearchResultsProps {
  posts: any[];
  query?: string | null;
  currentUserId: string;
}

export default function SearchResults({ posts, query, currentUserId }: SearchResultsProps) {
  const sortedPosts = useMemo(() => {
    return posts.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [posts]);

  const grouped = useMemo(() => {
    return sortedPosts.reduce((acc: Record<string, any[]>, p: any) => {
      const courseName = p.course || "Sin asignatura";
      acc[courseName] = acc[courseName] || [];
      acc[courseName].push(p);
      return acc;
    }, {} as Record<string, any[]>);
  }, [sortedPosts]);

  const groupEntries = Object.entries(grouped);

  if (posts.length === 0) {
    return (
      <Typography sx={{ mt: 4, color: "text.secondary" }}>
        {`No se encontraron posts con el título o palabra clave '${query}'. Busca otra palabra o selecciona otro plan en la vista anterior.`}
      </Typography>
    );
  }

  return (
    <>
      {groupEntries.map(([courseName, postsForCourse]) => (
        <Grid key={courseName} size={{ xs: 12 }}>
          <CourseSection courseName={courseName} postsForCourse={postsForCourse} currentUserId={currentUserId} />
        </Grid>
      ))}
    </>
  );
}
