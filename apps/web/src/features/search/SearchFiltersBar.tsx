import {
  Button,
  FormControlLabel,
  MenuItem,
  Stack,
  Switch,
  TextField,
} from "@mui/material";
import {
  hasActiveFilters,
  LANGUAGES,
  MIN_STARS_OPTIONS,
  SORT_OPTIONS,
  type SearchFilters,
  type SortKey,
} from "./filters";
import { LanguageDot } from "@repo-radar/ui";

interface SearchFiltersBarProps {
  filters: SearchFilters;
  onChange: (patch: Partial<SearchFilters>) => void;
  onReset: () => void;
}

export function SearchFiltersBar({
  filters,
  onChange,
  onReset,
}: SearchFiltersBarProps) {
  return (
    <Stack
      direction="row"
      useFlexGap
      sx={{ flexWrap: "wrap", gap: 1, alignItems: "center" }}
    >
      {/* Language Filter */}
      <TextField
        select
        label="Language"
        value={filters.language ?? ""}
        onChange={(e) => onChange({ language: e.target.value || null })}
        sx={{ minWidth: 170 }}
      >
        <MenuItem value="">Any language</MenuItem>
        {LANGUAGES.map((lang) => (
          <MenuItem key={lang} value={lang}>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <LanguageDot language={lang} />
              <span>{lang}</span>
            </Stack>
          </MenuItem>
        ))}
      </TextField>

      {/* Stars Filter */}
      <TextField
        select
        label="Stars"
        value={filters.minStars}
        onChange={(e) => onChange({ minStars: Number(e.target.value) })}
        sx={{ minWidth: 130 }}
      >
        {MIN_STARS_OPTIONS.map((o) => (
          <MenuItem key={o.value} value={o.value}>
            {o.label}
          </MenuItem>
        ))}
      </TextField>

      {/* Sort Filter */}
      <TextField
        select
        label="Sort"
        value={filters.sort}
        onChange={(e) => onChange({ sort: e.target.value as SortKey })}
        sx={{ minWidth: 170 }}
      >
        {SORT_OPTIONS.map((o) => (
          <MenuItem key={o.value} value={o.value}>
            {o.label}
          </MenuItem>
        ))}
      </TextField>

      {/* Hide archived Button */}
      <FormControlLabel
        label="Hide archived"
        control={
          <Switch
            size="small"
            checked={filters.hideArchived}
            onChange={(e) => onChange({ hideArchived: e.target.checked })}
          />
        }
        slotProps={{ typography: { variant: "body2" } }}
      />
      {/* Clear filters Button (Appear when filters are active) */}
      {hasActiveFilters(filters) && (
        <Button size="small" onClick={onReset} sx={{ ml: "auto" }}>
          Clear filters
        </Button>
      )}
    </Stack>
  );
}
