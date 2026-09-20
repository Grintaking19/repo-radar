import type { ReactNode } from "react";
import { Avatar, Box, Chip, Link, Stack, Typography } from "@mui/material";
import { LanguageDot } from "@repo-radar/ui";

export interface SearchResultItemProps {
  avatarUrl: string;
  fullName: string;
  url: string;
  description: string | null;
  topics: string[];
  language: string | null;
  stars: string;
  updatedLabel: string;
  archived?: boolean;

  /** Track / untrack button */
  action?: ReactNode;
}

export function SearchResultItem({
  avatarUrl,
  fullName,
  url,
  description,
  topics,
  language,
  stars,
  updatedLabel,
  archived,
  action,
}: SearchResultItemProps) {
  return (
    <Box
      component="li"
      sx={{
        display: "flex",
        gap: 2,
        py: 2,
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Avatar
        src={avatarUrl}
        alt={fullName}
        variant="rounded"
        sx={{ width: 40, height: 40, flexShrink: 0 }}
      />

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

        {description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1,
              display: "-webkit-box",
              webkitLineClamp: 2,
              webkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {description}
          </Typography>
        )}

        {topics?.length > 0 && (
          <Stack
            direction="row"
            spacing={0.5}
            sx={{ mb: 1, flexWrap: "wrap", gap: 0.5 }}
          >
            {topics.map((topic) => (
              <Chip
                key={topic}
                label={topic}
                sx={{
                  bgColor: "action.hover",
                  color: "text.secondary",
                  height: 22,
                }}
              />
            ))}
          </Stack>
        )}

        <Stack
          direction="row"
          spacing={2}
          sx={{ flexWrap: "wrap", rowGap: 0.5, alignItems: "center" }}
        >
          {language && (
            <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
              <LanguageDot language={language} />
              <Typography variant="caption" color="text.secondary">
                {language}
              </Typography>
            </Stack>
          )}

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "flex" }}
          >
            ★ {stars}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            Updated {updatedLabel}
          </Typography>
        </Stack>
      </Box>

      {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
    </Box>
  );
}
