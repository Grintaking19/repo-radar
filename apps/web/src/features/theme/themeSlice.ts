import { createSlice } from "@reduxjs/toolkit";
import type { PaletteMode } from "@mui/material";
import type { RootState } from "../../app/store";
import { loadColorMode } from "../../utils/storage";

export interface ThemeState {
  colorMode: PaletteMode;
}

const initialState: ThemeState = {
  colorMode: loadColorMode(),
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    colorModeToggled(state) {
      state.colorMode = state.colorMode === "light" ? "dark" : "light";
    },
  },
});

export const { colorModeToggled } = themeSlice.actions;
export const selectColorMode = (state: RootState) => state.theme.colorMode;
export default themeSlice.reducer;
