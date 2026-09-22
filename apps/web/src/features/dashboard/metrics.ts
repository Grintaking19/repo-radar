export type ActivityStatus =
  | "active"
  | "slowing"
  | "stale"
  | "archived"
  | "unknown";

export type Color = "success" | "warning" | "error" | "default";

const DAY = 1000 * 60 * 60 * 24;

export function daysSince(iso: string | null): number | null {
  if (!iso) return null;
  const then = new Date(iso).getTime();
  const now = Date.now();
  return Math.floor((now - then) / DAY);
}

export function getActivityStatus(
  iso: string | null,
  archived: boolean,
): ActivityStatus {
  if (archived) return "archived";
  const days = daysSince(iso);
  if (days === null) return "unknown";
  if (days < 30) return "active";
  if (days < 180) return "slowing";
  return "stale";
}

export const ACTIVITY_LABEL: Record<ActivityStatus, string> = {
  active: "Active",
  slowing: "Slowing",
  stale: "Stale",
  archived: "Archived",
  unknown: "Unknown",
};

export const ACTIVITY_COLOR: Record<ActivityStatus, Color> = {
  active: "success",
  slowing: "warning",
  stale: "error",
  archived: "default",
  unknown: "default",
};

/** Order of activity statuses for sorting and display. (Healthest first) */
export const ACTIVITY_ORDER = [
  "active",
  "slowing",
  "stale",
  "archived",
  "unknown",
] as const satisfies readonly ActivityStatus[];

/** How each status is decided, shown as a hint in the UI. */
export const ACTIVITY_RULE: Record<ActivityStatus, string> = {
  active: "Commit in the last 30 days",
  slowing: "Last commit 30–179 days ago",
  stale: "No commit for 180+ days",
  archived: "Archived on GitHub",
  unknown: "Commit date unavailable",
};
