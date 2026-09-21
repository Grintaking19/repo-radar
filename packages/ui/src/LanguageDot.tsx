import { Box } from "@mui/material";

const COLORS: Record<string, string> = {
  TypeScript: "#3178C6",
  JavaScript: "#F7DF1E",
  Python: "#3776AB",
  Java: "#007396",
  C: "#A8B9CC",
  "C++": "#00599C",
  "C#": "#239120",
  Go: "#00ADD8",
  Ruby: "#CC342D",
  PHP: "#777BB4",
  Swift: "#FA7343",
  Kotlin: "#A97BFF",
  Rust: "#DEA584",
  Dart: "#0175C2",
  Scala: "#DC322F",
  Haskell: "#5E5086",
  Lua: "#000080",
  R: "#276DC3",
  HTML: "#E34F26",
  CSS: "#563D7C",
  Shell: "#89E051",
  Vue: "#42B883",
  React: "#61DAFB",
  Angular: "#DD0031",
};

export function LanguageDot({ language }: { language: string }) {
  return (
    <Box
      component="span"
      sx={{
        width: 10,
        height: 10,
        borderRadius: "50%",
        bgcolor: COLORS[language] ?? "text.disabled",
        display: "inline-block",
        flexShrink: 0,
      }}
    />
  );
}
