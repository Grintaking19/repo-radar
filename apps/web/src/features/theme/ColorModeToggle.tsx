import { IconButton, Tooltip } from "@mui/material";
import { Moon, Sun } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { colorModeToggled, selectColorMode } from "./themeSlice";
 
export function ColorModeToggle() {
  const dispatch = useAppDispatch();
  const mode = useAppSelector(selectColorMode);
  const label = `Switch to ${mode === "dark" ? "light" : "dark"} mode`;
 
  return (
    <Tooltip title={label}>
      <IconButton
        color="inherit"
        aria-label={label}
        onClick={() => dispatch(colorModeToggled())}
      >
        {mode === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </IconButton>
    </Tooltip>
  );
}