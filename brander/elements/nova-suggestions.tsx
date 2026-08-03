import { Box } from "@mui/material";

interface Suggestion {
  label: string;
  query?: string;
}

export interface Props {
  suggestions: Suggestion[];
  onSelectSuggestion?: (suggestion: { label: string; query: string }) => void;
}

export default function Component({ suggestions, onSelectSuggestion }: Props) {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 1.25,
        py: 0.5,
      }}
    >
      {suggestions.slice(0, 4).map((suggestion) => (
        <Box
          key={suggestion.label}
          component="button"
          type="button"
          onClick={() =>
            onSelectSuggestion?.({
              label: suggestion.label,
              query: suggestion.query || suggestion.label,
            })
          }
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.75,
            border: "1px solid #E4D6C2",
            bgcolor: "#FFFFFF",
            color: "#3B2E25",
            borderRadius: "999px",
            px: 2,
            py: 0.9,
            fontSize: 13.5,
            fontFamily: "inherit",
            cursor: "pointer",
            transition: "background-color 140ms ease, color 140ms ease, border-color 140ms ease",
            "&:hover": {
              bgcolor: "#C06B4A",
              borderColor: "#C06B4A",
              color: "#FDF8F0",
            },
          }}
        >
          <Box component="span" sx={{ fontSize: 11, opacity: 0.7 }}>
            ✦
          </Box>
          {suggestion.label}
        </Box>
      ))}
    </Box>
  );
}
