import { Box, Skeleton } from "@mui/material";

export default function SkeletonComponent() {
  return (
    <Box sx={{ width: "100%", maxWidth: 680, mx: "auto", display: "flex", gap: 2.5 }}>
      <Skeleton variant="rounded" width={230} height={336} sx={{ borderRadius: "5px", flexShrink: 0 }} />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1.25 }}>
        <Skeleton variant="text" width="60%" height={28} />
        <Skeleton variant="text" width="20%" height={20} />
        <Box sx={{ display: "flex", gap: 0.75 }}>
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rounded" width={40} height={32} />
          ))}
        </Box>
        <Skeleton variant="rounded" width="100%" height={40} sx={{ borderRadius: "20px" }} />
        <Skeleton variant="text" width="45%" height={18} />
        <Skeleton variant="rounded" width="100%" height={44} sx={{ mt: "auto", borderRadius: "6px" }} />
      </Box>
    </Box>
  );
}
