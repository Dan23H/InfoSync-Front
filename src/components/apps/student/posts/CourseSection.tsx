import { useState, useMemo } from "react";
import { Card, CardHeader, CardContent, Collapse, IconButton, Box, Button, Typography } from "@mui/material";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import PostCard from "./PostCard";

interface CourseSectionProps {
  courseName: string;
  postsForCourse: any[];
  currentUserId: string;
}

export default function CourseSection({ courseName, postsForCourse, currentUserId }: CourseSectionProps) {
  const qPosts = postsForCourse.filter((p) => p.type === "Q");
  const sPosts = postsForCourse.filter((p) => p.type === "S");

  // UI toggles
  const [questionsOpen, setQuestionsOpen] = useState(true);
  const [suggestionsOpen, setSuggestionsOpen] = useState(true);

  // Sorting state
  const [questionsDateDesc, setQuestionsDateDesc] = useState(true); // true => Más recientes
  const [suggestionsDateDesc, setSuggestionsDateDesc] = useState(true);
  const [suggestionsSortMode, setSuggestionsSortMode] = useState<"date" | "recommendation">("date");
  const [suggestionsRecDesc, setSuggestionsRecDesc] = useState(true); // true => Más recomendados

  // Derived sorted lists
  const sortedQPosts = useMemo(() => {
    const copy = qPosts.slice();
    copy.sort((a: any, b: any) => {
      const ta = new Date(a.createdAt).getTime();
      const tb = new Date(b.createdAt).getTime();
      return questionsDateDesc ? tb - ta : ta - tb;
    });
    return copy;
  }, [qPosts, questionsDateDesc]);

  const sortedSPosts = useMemo(() => {
    const copy = sPosts.slice();
    if (suggestionsSortMode === "recommendation") {
      // sort by recommendation score (likes - dislikes) or likes if dislikes missing
      copy.sort((a: any, b: any) => {
        const sa = (a.likeCount ?? 0) - (a.dislikeCount ?? 0);
        const sb = (b.likeCount ?? 0) - (b.dislikeCount ?? 0);
        return suggestionsRecDesc ? sb - sa : sa - sb;
      });
    } else {
      copy.sort((a: any, b: any) => {
        const ta = new Date(a.createdAt).getTime();
        const tb = new Date(b.createdAt).getTime();
        return suggestionsDateDesc ? tb - ta : ta - tb;
      });
    }
    return copy;
  }, [sPosts, suggestionsSortMode, suggestionsDateDesc, suggestionsRecDesc]);

  return (
    <Card className="course-section-card">
      <CardHeader title={courseName} />
      <CardContent>
        {sortedQPosts.length > 0 && (
          <Card sx={{ mb: 1 }} elevation={0}>
            <CardHeader
              title="Preguntas"
              onClick={() => setQuestionsOpen((v) => !v)}
              sx={{ ":hover": { cursor: "pointer" } }}
              action={
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  {/* Date sort toggle for questions */}
                  <Button
                    size="small"
                    variant={questionsDateDesc ? "contained" : "text"}
                    sx={questionsDateDesc ? { bgcolor: "primary.dark", color: "#fff" } : {}}
                    onClick={(e) => {
                      e.stopPropagation();
                      setQuestionsDateDesc((v) => !v);
                    }}
                  >
                    {questionsDateDesc ? "Más recientes" : "Más antiguos"}
                  </Button>

                  <IconButton
                    aria-label={questionsOpen ? "Ocultar preguntas" : "Mostrar preguntas"}
                    onClick={(e) => {
                      e.stopPropagation();
                      setQuestionsOpen((v) => !v);
                    }}
                  >
                    <Typography variant="body2" sx={{ mr: 1 }}>{questionsOpen ? "Ocultar preguntas" : "Mostrar preguntas"}</Typography>
                    {questionsOpen ? <AiFillEyeInvisible /> : <AiFillEye />}
                  </IconButton>
                </Box>
              }
            />
            <Collapse in={questionsOpen} timeout="auto" unmountOnExit>
              <CardContent>
                {sortedQPosts.map((p) => (
                  <PostCard key={p._id} post={p} currentUserId={currentUserId} />
                ))}
              </CardContent>
            </Collapse>
          </Card>
        )}

        {sortedSPosts.length > 0 && (
          <Card elevation={0}>
            <CardHeader
              title="Sugerencias"
              onClick={() => setSuggestionsOpen((v) => !v)}
              sx={{ ":hover": { cursor: "pointer" } }}
              action={
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  {/* Date sort toggle for suggestions */}
                  <Button
                    size="small"
                    variant={suggestionsSortMode === "date" ? "contained" : "text"}
                    sx={suggestionsSortMode === "date" ? { bgcolor: "primary.dark", color: "#fff" } : {}}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (suggestionsSortMode === "date") {
                        setSuggestionsDateDesc((v) => !v);
                      } else {
                        setSuggestionsSortMode("date");
                        setSuggestionsDateDesc(true);
                      }
                    }}
                  >
                    {suggestionsDateDesc ? "Más recientes" : "Más antiguos"}
                  </Button>

                  {/* Recommendation sort toggle */}
                  <Button
                    size="small"
                    variant={suggestionsSortMode === "recommendation" ? "contained" : "text"}
                    sx={suggestionsSortMode === "recommendation" ? { bgcolor: "primary.dark", color: "#fff" } : {}}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (suggestionsSortMode === "recommendation") {
                        setSuggestionsRecDesc((v) => !v);
                      } else {
                        setSuggestionsSortMode("recommendation");
                        setSuggestionsRecDesc(true);
                      }
                    }}
                  >
                    {suggestionsRecDesc ? "Más recomendados" : "Menos recomendados"}
                  </Button>

                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      setSuggestionsOpen((v) => !v);
                    }}
                  >
                    {suggestionsOpen ? <AiFillEyeInvisible /> : <AiFillEye />}
                  </IconButton>
                </Box>
              }
            />
            <Collapse in={suggestionsOpen} timeout="auto" unmountOnExit>
              <CardContent>
                {sortedSPosts.map((p) => (
                  <PostCard key={p._id} post={p} currentUserId={currentUserId} />
                ))}
              </CardContent>
            </Collapse>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
