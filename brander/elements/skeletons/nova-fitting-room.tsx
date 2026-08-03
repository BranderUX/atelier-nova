import { Box, Skeleton } from "@mui/material";

export default function SkeletonComponent() {
  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2.5 }}>
      <Skeleton variant="rounded" width={380} height={500} sx={{ borderRadius: "6px", maxWidth: "100%" }} />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1.25 }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <Skeleton key={i} variant="rounded" width="100%" height={72} sx={{ borderRadius: "6px" }} />
        ))}
        <Skeleton variant="rounded" width="100%" height={46} sx={{ mt: "auto", borderRadius: "5px" }} />
      </Box>
    </Box>
  );
}
