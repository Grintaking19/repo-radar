const compact = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});


export const formatCount = (n: number) => compact.format(n);

const relative = new Intl.RelativeTimeFormat("en", {
    numeric: "auto",
});

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 3600 * 24 * 365],
    ["month", 3600 * 24 * 30],
    ["week", 3600 * 24 * 7],
    ["day", 3600 * 24],
    ["hour", 3600],
    ["minute", 60],
    ["second", 1],
];

/** Converting ISO date -> "3 days ago" */
export function formatRelative(isoDate: string): string {
    if (!isoDate) return "unknown";
    const seconds = (Date.now() - new Date(isoDate).getTime()) / 1000;
    for (const [unit, secondsInUnit] of UNITS) {
        if (seconds >= secondsInUnit ) {
            return relative.format(-Math.floor(seconds / secondsInUnit), unit); 
        }
    }
    return "just now";
}