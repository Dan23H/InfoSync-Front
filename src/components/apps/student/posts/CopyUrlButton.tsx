import { Box, Button } from "@mui/material";
import { useState, useRef } from "react";

export default function CopyUrlButton({ to }: { to: string }) {
  const [squareMounted, setSquareMounted] = useState(false);
  const [squareVisible, setSquareVisible] = useState(false);
  const hideTimerRef = useRef<number | null>(null);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(to);

    // Reset previous timer
    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    if (!squareMounted) {
      setSquareMounted(true);
      requestAnimationFrame(() => setSquareVisible(true));
    } else {
      setSquareVisible(true);
    }

    hideTimerRef.current = window.setTimeout(() => {
      setSquareVisible(false);
      window.setTimeout(() => setSquareMounted(false), 300);
      hideTimerRef.current = null;
    }, 5000);
  };

  return (
    <Box sx={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
      {squareMounted && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "100%",
            transform: squareVisible ? "translate(0, -50%)" : "translate(5px, -50%)",
            width: 20,
            height: 20,
            border: "2px solid green",
            borderRadius: 1,
            backgroundColor: "transparent",
            transition: "transform 300ms cubic-bezier(.42,0,.58,1), opacity 300ms",
            opacity: squareVisible ? 1 : 0,
            pointerEvents: "none",
            boxSizing: "border-box",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "green",
            fontSize: "1rem",
            lineHeight: 1.5,
            ml: 0.5,
          }}
        >
          <span aria-hidden="true">✔</span>
        </Box>
      )}

      <Button
        variant="outlined"
        size="small"
        sx={{
          color: "black",
          borderColor: "black",
          backgroundColor: "transparent",
          ":hover": {
            backgroundColor: "rgba(255, 0, 0, 0.3)",
            borderColor: "darkred",
          },
          position: "relative",
        }}
        onClick={handleCopyUrl}
      >
        Copiar URL
      </Button>
    </Box>
  );
}