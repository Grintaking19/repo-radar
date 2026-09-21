import { Box, Card, Skeleton } from "@mui/material";

export function SearchResultsSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <Card aria-busy="true" aria-label="Loading results">
      {Array.from({ length: rows }, (_, i) => (
        <Box
          key={i}
          sx={{
            display: "flex",
            gap: 2,
            p: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
            "&:last-of-type": { borderBottom: 0 },
          }}
        >
          <Skeleton variant="rounded" width={40} height={40} />
          <Box sx={{ flexGrow: 1 }}>
            <Skeleton width="40%" />
            <Skeleton width="85%" />
            <Skeleton width="30%" />
          </Box>
        </Box>
      ))}
    </Card>
  );
}
