import { Box, List, ListItemButton, Paper, TextField } from "@mui/material";
import { useRef } from "react";
import { useDeselect } from "../../../../hooks/useDeselect";

export default function CourseSearch({ value, onChange, suggestions, showSuggestions, setShowSuggestions }: any) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  useDeselect(wrapperRef, () => setShowSuggestions(false));

  return (
    <Box sx={{ position: "relative" }} ref={wrapperRef}>
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
        <Paper
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 10,
            maxHeight: 200,
            overflowY: "auto",
          }}
        >
          <List>
            {suggestions.map((s: string, i: number) => (
              <ListItemButton
                sx={{ fontSize: 16 }}
                key={i}
                onClick={() => {
                  onChange(s);
                  setShowSuggestions(false);
                }}
              >
                {s}
              </ListItemButton>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}
