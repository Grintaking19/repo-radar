import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { Radar } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";

export function EmptyTracked() {
  return (
    <Card>
      <CardContent sx={{ textAlign: "center", py: 8 }}>
        <Box sx={{ color: "primary.main", mb: 2 }}>
          <Radar size={40} strokeWidth={1.5} />
        </Box>
        <Typography variant="h2">Nothing on your radar yet</Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1, mb: 3, maxWidth: 420, mx: "auto" }}
        >
          Track repositories from search to see their health, compare them, and
          spot the ones that have gone quiet.
        </Typography>
        <Button variant="contained" component={RouterLink} to="/">
          Search repositories
        </Button>
      </CardContent>
    </Card>
  );
}