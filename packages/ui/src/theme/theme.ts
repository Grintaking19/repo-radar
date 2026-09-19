import { createTheme, type ThemeOptions } from '@mui/material';

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
  },
};

export const lightTheme = createTheme({
  ...shared,
  palette: {
    mode: "light",
    primary: { main: "#4F46E5" },
    background: { default: "#FAFAFA", paper: "#FFFFFF" },
    success: { main: "#15803D" },
    warning: { main: "#B45309" },
    error: { main: "#B91C1C" },
    divider: "#E5E7EB",
  },
});

export const darkTheme = createTheme({
  ...shared,
  palette: {
    mode: "dark",
    primary: { main: "#818CF8" },
    background: { default: "#0D1117", paper: "#161B22" },
    success: { main: "#3FB950" },
    warning: { main: "#D29922" },
    error: { main: "#F85149" },
    divider: "#30363D",
  },
});
