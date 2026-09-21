import type { ReactNode } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { darkTheme, lightTheme } from "@repo-radar/ui";
import { useAppSelector } from "./hooks";
import { selectColorMode } from "../features/theme/themeSlice";

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const mode = useAppSelector(selectColorMode);
  return (
    <ThemeProvider theme={mode === "dark" ? darkTheme : lightTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
