import { Box, Skeleton } from "@mui/material";

export default function SkeletonComponent() {
  return (
    <Box sx={{ width: "100%", maxWidth: 440, mx: "auto", display: "flex", flexDirection: "column", gap: 1.5 }}>
      <Skeleton variant="rounded" width="100%" height={420} sx={{ borderRadius: "5px" }} />
      <Skeleton variant="text" width="55%" height={30} />
      <Skeleton variant="text" width="20%" height={22} />
      <Box sx={{ display: "flex", gap: 1 }}>
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} variant="rounded" width={46} height={38} />
        ))}
      </Box>
      <Skeleton variant="rounded" width="100%" height={48} sx={{ borderRadius: "24px" }} />
      <Skeleton variant="rounded" width="100%" height={48} sx={{ borderRadius: "6px" }} />
    </Box>
  );
}
