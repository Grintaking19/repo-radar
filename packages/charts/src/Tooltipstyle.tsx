import type { Theme } from "@mui/material";
 
/** ECharts tooltips default to a white box; match the MUI theme instead (dark mode). */
export function tooltipStyle(theme: Theme) {
  return {
    backgroundColor: theme.palette.background.paper,
    borderColor: theme.palette.divider,
    textStyle: {
      color: theme.palette.text.primary,
      fontFamily: theme.typography.fontFamily,
      fontSize: 12,
    },
  };
}
 