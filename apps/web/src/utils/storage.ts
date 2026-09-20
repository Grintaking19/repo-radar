import type { TrackedState } from "../features/tracked/trackedSlice";

const KEY = "repo-radar:tracked-repos:v1";

export function loadTracked(): TrackedState | null {
  try {
    // Check if localStorage is available
    if (typeof localStorage === "undefined") {
      console.error("localStorage is not available");
      return null;
    }
    // Check if the data exists in localStorage
    const raw = localStorage.getItem(KEY);
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
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save tracked repos to localStorage", error);
  }
}
