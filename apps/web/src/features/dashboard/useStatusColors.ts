import { useMemo } from "react";
import { useTheme } from "@mui/material";
import type { ActivityStatus } from "../../utils/metrics";
 
/** Resolves each activity status to a concrete theme color (charts need hex values). */
export function useStatusColors(): Record<ActivityStatus, string> {
  const { palette } = useTheme();
  return useMemo(
    () => ({
      active: palette.success.main,
      slowing: palette.warning.main,
      stale: palette.error.main,
      archived: palette.text.secondary,
      unknown: palette.text.disabled,
    }),
    [palette],
  );
}