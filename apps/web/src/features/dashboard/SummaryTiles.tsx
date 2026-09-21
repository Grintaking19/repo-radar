import { Box } from "@mui/material";
import { StatTile } from "@repo-radar/ui";
import { formatCount, formatDays } from "../../utils/format";
import type { TrackedSummary } from "./insights";

export function SummaryTiles({ summary }: { summary: TrackedSummary }) {
  const languageCount = summary.languages.length;

  return (
    <Box
      sx={{
        display: "grid",
        gap: 2,
        gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
      }}
    >
      <StatTile
        label="Tracked"
        value={summary.count}
        hint={`${languageCount} ${languageCount === 1 ? "language" : "languages"}`}
      />
      <StatTile
        label="Needs attention"
        value={summary.needsAttention}
        hint="Stale or archived"
        tone={summary.needsAttention > 0 ? "warning" : "success"}
      />
      <StatTile
        label="Total stars"
        value={formatCount(summary.totalStars)}
        hint="Across tracked repos"
      />
      <StatTile
        label="Median last commit"
        value={formatDays(summary.medianIdleDays)}
        hint={summary.medianIdleDays === null ? "No commit data yet" : "Since the last commit"}
      />
    </Box>
  );
}