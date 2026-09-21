import { Card, CardContent, Skeleton, Stack } from "@mui/material";

export function RepoCardSkeleton() {
  return (
    <Card>
      <CardContent>
        <Skeleton variant="text" width={"70%"} height={24} />
        <Stack direction="row" spacing={1} sx={{ my: 1 }}>
          <Skeleton variant="rounded" width={60} height={22} />
          <Skeleton variant="rounded" width={80} height={22} />
        </Stack>
        <Skeleton variant="text" width="90%" />
        <Skeleton variant="text" width="50%" />
      </CardContent>
    </Card>
  );
}
