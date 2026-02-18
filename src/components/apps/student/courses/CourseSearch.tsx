import "../../../../styles/student-courses.css";
import { Box, List, ListItemButton, Paper, TextField, Typography } from "@mui/material";
import { useRef } from "react";
import { useDeselect } from "../../../../hooks/useDeselect";

export default function CourseSearch({ value, onChange, suggestions, showSuggestions, setShowSuggestions }: any) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  useDeselect(wrapperRef, () => setShowSuggestions(false));

  return (
    <Box className="course-search-wrapper" ref={wrapperRef}>
      <TextField
        label="Asignatura"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        fullWidth
      />
      {showSuggestions && suggestions.length > 0 && (
        <Paper className="course-search-suggestions">
          <List>
            {suggestions.map((s: string, i: number) => (
              <ListItemButton
                className="course-search-suggestion"
                key={i}
                onClick={() => {
                  onChange(s);
                  setShowSuggestions(false);
                }}
              >
                <Typography className="course-search-suggestion">
                  {s}
                </Typography>
              </ListItemButton>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}
