import type { ReactNode } from "react";
import { Card, CardContent, Typography } from "@mui/material";

export interface StatTileProps {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  /** Colors the value, e.g. "warning" when something needs attention. */
  tone?: "default" | "success" | "warning" | "error";
}

export function StatTile({ label, value, hint, tone = "default" }: StatTileProps) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary" component="p">
          {label}
        </Typography>
        <Typography
          component="p"
          sx={{
            mt: 0.5,
            fontSize: "1.75rem",
            fontWeight: 600,
            lineHeight: 1.2,
            color: tone === "default" ? "text.primary" : `${tone}.main`,
          }}
        >
          {value}
        </Typography>
        {hint && (
          <Typography variant="caption" color="text.secondary" component="p" sx={{ mt: 0.5 }}>
            {hint}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}