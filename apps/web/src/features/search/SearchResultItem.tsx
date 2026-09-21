import type { ReactNode } from "react";
import {
  alpha,
  Avatar,
  Box,
  Chip,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { LanguageDot } from "@repo-radar/ui";

export interface SearchResultItemProps {
  avatarUrl: string;
  fullName: string;
  url: string;
  description: string | null;
  topics: string[];
  language: string | null;
  forks?: string;
  license?: string | null;
  stars: string;
  updatedLabel: string;
  archived?: boolean;

  /** Track / untrack button */
  action?: ReactNode;
}

const MAX_TOPICS = 5;

export function SearchResultItem({
  avatarUrl,
  fullName,
  url,
  description,
  topics,
  language,
  stars,
  forks,
  license,
  updatedLabel,
  archived,
  action,
}: SearchResultItemProps) {
  const showLicense = license && license !== "NOASSERTION";

  return (
    <Box
      component="li"
      sx={{
        display: "flex",
        gap: 2,
        py: 2,
        borderBottom: "1px solid",
        borderColor: "divider",
        "&:last-of-type": { borderBottom: 0 },
      }}
    >
      <Avatar
        src={avatarUrl}
        alt={fullName}
        variant="rounded"
        sx={{ width: 40, height: 40, flexShrink: 0 }}
      />
      {/* Link to the repository (Github itself) */}
      <Box sx={{ minWidth: 0, flexGrow: 1 }}>
        <Stack direction="row" spacing={1} sx={{ mb: 0.5 }}>
          <Link
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            sx={{ fontWeight: "bold", color: "text.primary" }}
          >
            {fullName}
          </Link>
          {archived && (
            <Chip label="Archived" color="warning" variant="outlined" />
          )}
        </Stack>

        {/* Description of the repository */}
        {description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              overflowWrap: "anywhere",
            }}
          >
            {description}
          </Typography>
        )}

        {/* Topics of the repository (up to 5, similar to github) */}
        {topics?.length > 0 && (
          <Stack
            direction="row"
            useFlexGap
            sx={{ mb: 1, flexWrap: "wrap", gap: 0.5 }}
          >
            {topics.slice(0, MAX_TOPICS).map((topic) => (
              <Chip
                key={topic}
                label={topic}
                sx={{
                  height: 22,
                  borderRadius: 11,
                  fontSize: "0.75rem",
                  color: "primary.main",
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                }}
              />
            ))}
          </Stack>
        )}

        {/* Language, Stars, Updated */}
        <Stack
          direction="row"
          useFlexGap
          sx={{
            flexWrap: "wrap",
            columnGap: 2,
            rowGap: 0.5,
            alignItems: "center",
            color: "text.secondary",
          }}
        >
          {language && (
            <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
              <LanguageDot language={language} />
              <Typography variant="caption">{language}</Typography>
            </Stack>
          )}
          <Typography variant="caption">★ {stars}</Typography>
          {forks && <Typography variant="caption">⑂ {forks}</Typography>}
          {showLicense && <Typography variant="caption">{license}</Typography>}
          <Typography variant="caption">Updated {updatedLabel}</Typography>
        </Stack>
      </Box>

      {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
    </Box>
  );
}
