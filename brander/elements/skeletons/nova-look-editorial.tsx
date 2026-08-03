import { Box, Skeleton } from "@mui/material";

export default function SkeletonComponent() {
  return (
    <Box sx={{ width: "100%" }}>
      <Skeleton variant="text" width="30%" height={34} />
      <Skeleton variant="text" width="45%" height={20} />
      <Box sx={{ mt: 2, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} variant="rounded" sx={{ width: "100%", aspectRatio: "3 / 4", height: "auto", borderRadius: "6px" }} />
        ))}
      </Box>
    </Box>
  );
}
