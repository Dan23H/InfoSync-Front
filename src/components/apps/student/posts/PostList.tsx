import { Typography, IconButton, Card, CardHeader, CardContent, Collapse, Grid } from "@mui/material";
import { useState } from "react";
import PostCard from "./PostCard";
import type { Post } from "../../../../models/types";

interface PostListProps {
  posts: Post[];
  course: string;
}

export default function PostList({ posts, course }: PostListProps) {
  const [showQuestions, setShowQuestions] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const questions = posts.filter((p) => p.type === "Q");
  const suggestions = posts.filter((p) => p.type === "S");

  return (
    <Grid>
      <Typography variant="h4" sx={{ mb: 2 }}>
        {course}
      </Typography>

      <Grid>
        {/* Preguntas */}
        <Card sx={{ mb: 2 }} >
          <CardHeader
            title="Preguntas"
            onClick={() => setShowQuestions((prev) => !prev)}
            sx={{ ":hover": { cursor: "pointer" } }}
            action={
              <IconButton>
                {showQuestions ? "ExpandLessIcon" : "ExpandMoreIcon"}
              </IconButton>
            }
          />
          <Collapse in={showQuestions} timeout="auto" unmountOnExit>
            <CardContent>
              {questions.length === 0 ? (
                <Typography variant="body2">No hay preguntas todavía.</Typography>
              ) : (
                questions.map((q) => <PostCard key={q._id} post={q} />)
              )}
            </CardContent>
          </Collapse>
        </Card>
      </Grid>

      <Grid>
        {/* Sugerencias */}
        <Card >
          <CardHeader
            title="Sugerencias"
            onClick={() => setShowSuggestions((prev) => !prev)}
            sx={{ ":hover": { cursor: "pointer" } }}
            action={
              <IconButton>
                {showSuggestions ? "ExpandLessIcon" : "ExpandMoreIcon"}
              </IconButton>
            }
          />
          <Collapse in={showSuggestions} timeout="auto" unmountOnExit>
            <CardContent>
              {suggestions.length === 0 ? (
                <Typography variant="body2">No hay sugerencias todavía.</Typography>
              ) : (
                suggestions.map((s) => <PostCard key={s._id} post={s} />)
              )}
            </CardContent>
          </Collapse>
        </Card>
      </Grid>
    </Grid>
  );
}
