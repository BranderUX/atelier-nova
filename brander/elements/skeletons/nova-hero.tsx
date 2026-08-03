import { Box, Skeleton } from "@mui/material";

export default function SkeletonComponent() {
  return (
    <Box sx={{ width: "100%" }}>
      <Skeleton variant="rounded" width="100%" height={480} sx={{ borderRadius: "6px" }} />
    </Box>
  );
}
