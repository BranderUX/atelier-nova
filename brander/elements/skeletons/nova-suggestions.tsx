import { Box, Skeleton } from "@mui/material";

export default function SkeletonComponent() {
  return (
    <Box sx={{ width: "100%", display: "flex", justifyContent: "center", gap: 1.25, py: 0.5 }}>
      {[0, 1, 2].map((i) => (
        <Skeleton key={i} variant="rounded" width={150} height={36} sx={{ borderRadius: "999px" }} />
      ))}
    </Box>
  );
}
