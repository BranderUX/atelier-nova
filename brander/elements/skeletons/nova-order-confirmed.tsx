import { Box, Skeleton } from "@mui/material";

export default function SkeletonComponent() {
  return (
    <Box sx={{ width: "100%", maxWidth: 460, mx: "auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5, py: 4 }}>
      <Skeleton variant="circular" width={64} height={64} />
      <Skeleton variant="text" width="50%" height={40} />
      <Skeleton variant="text" width="35%" height={20} />
      <Skeleton variant="rounded" width={180} height={44} sx={{ borderRadius: "24px" }} />
    </Box>
  );
}
