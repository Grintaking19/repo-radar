import type { TrackedState } from "../features/tracked/trackedSlice";
import type { PaletteMode } from "@mui/material";

const TRACKED_KEY = "repo-radar:tracked-repos:v1";
const COLOR_MODE_KEY = "repo-radar:color-mode:v1";

export function loadTracked(): TrackedState | null {
  try {
    // Check if localStorage is available
    if (typeof localStorage === "undefined") {
      console.error("localStorage is not available");
      return null;
    }
    // Check if the data exists in localStorage
    const raw = localStorage.getItem(TRACKED_KEY);
    if (!raw) {
      return null;
    }
    // Parse the data and validate its structure
    const parsed = JSON.parse(raw) as TrackedState;
    if (!Array.isArray(parsed.ids) || typeof parsed.snapshots !== "object") {
      console.error("Invalid tracked repos data in localStorage", parsed);
      return null;
    }
    return parsed;
  } catch (error) {
    console.error("Failed to load tracked repos from localStorage", error);
    return null;
  }
}

export function saveTracked(state: TrackedState): void {
  try {
    // Check if localStorage is available
    if (typeof localStorage === "undefined") {
      console.error("localStorage is not available");
      return;
    }
    // Check if the state is valid
    localStorage.setItem(TRACKED_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save tracked repos to localStorage", error);
  }
}

export function loadColorMode(): PaletteMode {
  try {
    const saved = localStorage.getItem(COLOR_MODE_KEY);
    if (saved === "light" || saved === "dark") {
      return saved;
    }
  } catch {
    // Default to OS preference
  }
  if (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
}

export function saveColorMode(mode: PaletteMode): void {
  try {
    localStorage.setItem(COLOR_MODE_KEY, mode);
  } catch {
    // Ignore errors (mode won't persist, no big deal)
  }
}
