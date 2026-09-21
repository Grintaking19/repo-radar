import { AppBar, Badge, Box, Button, Toolbar, Typography } from "@mui/material";
import { NavLink, Link as RouterLink } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { selectTrackedCount } from "../features/tracked/selectors.ts";
import { ColorModeToggle } from "../features/theme/ColorModeToggle.tsx";

export function AppHeader() {
  const count = useAppSelector(selectTrackedCount);
  //   const { pathname } = useLocation();

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
        <Typography variant="h1" sx={{ fontSize: "1.125rem", flexShrink: 0 }}>
          <RouterLink
            to="/"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Repo Radar
          </RouterLink>
        </Typography>

        <Box sx={{ display: "flex", gap: 1, ml: 2 }}>
          <Button
            component={NavLink}
            to="/"
            sx={{ "&.active": { color: "primary.main", fontWeight: 600 } }}
          >
            Search
          </Button>
          <Button
            component={NavLink}
            to="/tracked"
            sx={{ "&.active": { color: "primary.main", fontWeight: 600 } }}
          >
            <Badge badgeContent={count} color="secondary">
              Tracked
            </Badge>
          </Button>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <ColorModeToggle />
      </Toolbar>
    </AppBar>
  );
}
