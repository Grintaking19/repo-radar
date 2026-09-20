import {Box} from "@mui/material";
import {Outlet} from "react-router-dom";
import {AppHeader} from "./AppHeader.tsx";


export function AppLayout() {
    return (
        <>
            <AppHeader />
            <Box component="main" sx={{ maxWidth: 900, mx: "auto", px: 3, py: 2 }}>
                <Outlet />
            </Box>
        </>
    )
}