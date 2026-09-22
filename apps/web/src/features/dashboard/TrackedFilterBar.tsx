import {
  Button,
  Chip,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { Search } from "lucide-react";
import { LanguageDot } from "@repo-radar/ui";
import {
  ACTIVITY_COLOR,
  ACTIVITY_LABEL,
  ACTIVITY_ORDER,
  type ActivityStatus,
} from "./metrics";
import {
  TRACKED_SORT_OPTIONS,
  hasActiveTrackedFilters,
  type TrackedFilters,
  type TrackedSort,
} from "./filters";

interface Props {
  filters: TrackedFilters;
  statusCounts: Record<ActivityStatus, number>;
  languages: string[];
  onChange: (patch: Partial<TrackedFilters>) => void;
  onStatusToggle: (status: ActivityStatus) => void;
  onReset: () => void;
}

export function TrackedFiltersBar({
  filters,
  statusCounts,
  languages,
  onChange,
  onStatusToggle,
  onReset,
}: Props) {
  return (
    <Stack spacing={1.5}>
      <Stack
        direction="row"
        useFlexGap
        sx={{ flexWrap: "wrap", gap: 1.5, alignItems: "center" }}
      >
        <TextField
          placeholder="Filter by name, description or topic"
          value={filters.text}
          onChange={(e) => onChange({ text: e.target.value })}
          sx={{ flex: "1 1 260px" }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={16} />
                </InputAdornment>
              ),
            },
            htmlInput: { "aria-label": "Filter tracked repositories" },
          }}
        />

        <TextField
          select
          label="Language"
          value={filters.language ?? ""}
          onChange={(e) => onChange({ language: e.target.value || null })}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="">Any language</MenuItem>
          {languages.map((lang) => (
            <MenuItem key={lang} value={lang}>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <LanguageDot language={lang} />
                <span>{lang}</span>
              </Stack>
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Sort"
          value={filters.sort}
          onChange={(e) => onChange({ sort: e.target.value as TrackedSort })}
          sx={{ minWidth: 170 }}
        >
          {TRACKED_SORT_OPTIONS.map((o) => (
            <MenuItem key={o.value} value={o.value}>
              {o.label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      <Stack
        direction="row"
        useFlexGap
        sx={{ flexWrap: "wrap", gap: 1, alignItems: "center" }}
        role="group"
        aria-label="Filter by status"
      >
        {ACTIVITY_ORDER.filter((s) => statusCounts[s] > 0).map((status) => {
          const selected = filters.statuses.includes(status);
          return (
            <Chip
              key={status}
              label={`${ACTIVITY_LABEL[status]} · ${statusCounts[status]}`}
              color={ACTIVITY_COLOR[status]}
              variant={selected ? "filled" : "outlined"}
              onClick={() => onStatusToggle(status)}
              aria-pressed={selected}
            />
          );
        })}

        {hasActiveTrackedFilters(filters) && (
          <Button size="small" onClick={onReset} sx={{ ml: "auto" }}>
            Clear filters
          </Button>
        )}
      </Stack>
    </Stack>
  );
}