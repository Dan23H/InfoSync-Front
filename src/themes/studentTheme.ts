import { createTheme } from "@mui/material/styles";

export const studentTheme = createTheme({
  palette: {
    primary: {
      main: "#741823",
    },
    secondary: {
      main: "#741823",
    },
  },
  typography: {
    fontFamily: "roboto, roboto-slab, roboto-condensed",
    body1: {
      fontSize: "1rem",
      lineHeight: 1.5,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          border: "1px solid rgba(0, 0, 0, 0.12)",
          borderRadius: 8,
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "8px 16px",
          textTransform: "none",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          fontWeight: "bold",
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: "red",
          width: 24,
          height: 24,
        },
      },
    },
  },
  spacing: 8, // Espaciado base
});
