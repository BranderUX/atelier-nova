import { Box, Skeleton } from "@mui/material";

export default function SkeletonComponent() {
  return (
    <Box sx={{ width: "100%", maxWidth: 380, mx: "auto", display: "flex", flexDirection: "column", gap: 1.5 }}>
      <Skeleton variant="text" width="60%" height={32} sx={{ mx: "auto" }} />
      <Box sx={{ display: "flex", gap: 1.25 }}>
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} variant="rounded" width="100%" height={150} sx={{ flex: 1 }} />
        ))}
      </Box>
      <Skeleton variant="rounded" width="100%" height={44} sx={{ borderRadius: "5px" }} />
    </Box>
  );
}
