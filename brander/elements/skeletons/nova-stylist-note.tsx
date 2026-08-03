import { Box, Skeleton } from "@mui/material";

export default function SkeletonComponent() {
  return (
    <Box sx={{ width: "100%", maxWidth: 520, mx: "auto" }}>
      <Skeleton variant="rounded" width="100%" height={260} sx={{ borderRadius: "8px" }} />
    </Box>
  );
}
