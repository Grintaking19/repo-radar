import { createTheme, type ThemeOptions } from "@mui/material";

const shared: ThemeOptions = {
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: `"Inter", "system-ui", -apple-system, sans-serif`,
    h1: { fontSize: "1.5rem", fontWeight: 600 },
    h2: { fontSize: "1.25rem", fontWeight: 600 },
    h3: { fontSize: "1.125rem", fontWeight: 600 },
    subtitle1: { fontSize: "1rem", fontWeight: 500 },
    subtitle2: { fontSize: "0.8125rem", fontWeight: 500 },
    body2: { fontSize: "0.875rem" },
    caption: { fontSize: "0.75rem" },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { textTransform: "none", fontWeight: 500 } },
    },
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: "none" } },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: { root: { border: "1px solid", borderColor: "divider" } },
    },
    MuiChip: {
      defaultProps: { size: "small" },
      styleOverrides: { root: { fontWeight: 500 } },
    },
    MuiTextField: {
      defaultProps: { size: "small" },
    },
    MuiTooltip: {
      defaultProps: { arrow: true },
    },
  },
};

export const lightTheme = createTheme({
  ...shared,
  palette: {
    mode: "light",
    primary: { main: "#0969DA" },
    secondary: { main: "#1F883D" },
    background: { default: "#F6F8FA", paper: "#FFFFFF" },
    text: { primary: "#1F2328", secondary: "#59636E" },
    success: { main: "#1A7F37" },
    warning: { main: "#9A6700" },
    error: { main: "#D1242F" },
    divider: "#D1D9E0",
  },
});

export const darkTheme = createTheme({
  ...shared,
  palette: {
    mode: "dark",
    primary: { main: "#4493F8" },
    secondary: { main: "#238636" },
    background: { default: "#0D1117", paper: "#151B23" },
    text: { primary: "#F0F6FC", secondary: "#9198A1" },
    success: { main: "#3FB950" },
    warning: { main: "#D29922" },
    error: { main: "#F85149" },
    divider: "#3D444D",
  },
});
