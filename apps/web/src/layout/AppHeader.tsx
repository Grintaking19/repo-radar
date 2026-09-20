import { AppBar, Badge, Box, Button, Toolbar, Typography } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { selectTrackedCount } from "../features/tracked/selectors.ts";

export function AppHeader() {
  const count = useAppSelector(selectTrackedCount);
  const { pathname } = useLocation();

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      sx={{
        borderBottom: "1px solid",
        borderColor: "divider",
        mb: 2,
      }}
    >
      <Toolbar sx={{ gap: 2 }}>
        <Typography variant="h1" sx={{ fontSize: '1.125rem', flexShrink: 0 }}>
            <RouterLink to="/" style={{ textDecoration: "none", color: "inherit" }}>
                Repo Radar
            </RouterLink>
        </Typography>

        <Box sx={{ display: "flex", gap: 1, ml:2}}>
            <Button
                component={RouterLink}
                to="/"
                style={{
                    textDecoration: "none",
                    color: pathname === "/" ? "primary.main" : "text.primary",
                }}
            >
                Search
            </Button>
            <Button
                component={RouterLink}
                to="/tracked"
                style={{
                    textDecoration: "none",
                    color: pathname === "/tracked" ? "primary.main" : "text.primary",
                }}
            >
                <Badge badgeContent={count} color="secondary">
                    Tracked
                </Badge>
            </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
