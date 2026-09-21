import {
  Button,
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

interface Props {
  fullName: string;
  message: string;
  onRetry: () => void;
  onUntrack: () => void;
}

export function RepoCardError({
  fullName,
  message,
  onRetry,
  onUntrack,
}: Props) {
  return (
    <Card
      sx={{ borderColor: "error.main", borderWidth: 1, borderStyle: "solid" }}
    >
      <CardContent>
        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", alignItems: "flex-start" }}
        >
          <Typography variant="subtitle2" noWrap>
            {fullName}
          </Typography>
          <IconButton
            size="small"
            aria-label={`Untrack ${fullName}`}
            onClick={onUntrack}
          >
            ✕
          </IconButton>
        </Stack>
        <Typography variant="body2" color="error" sx={{ my: 1.5 }}>
          {message}
        </Typography>
        <Button size="small" variant="outlined" onClick={onRetry}>
          Retry
        </Button>
      </CardContent>
    </Card>
  );
}
