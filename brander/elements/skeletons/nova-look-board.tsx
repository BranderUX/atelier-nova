import { Box, Skeleton } from "@mui/material";

export default function SkeletonComponent() {
  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 2 }}>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 2 }}>
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} variant="rounded" width="100%" height={260} sx={{ borderRadius: "6px" }} />
        ))}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1.5 }}>
        <Skeleton variant="text" width="40%" height={20} />
        <Skeleton variant="rounded" width={220} height={42} sx={{ borderRadius: "5px" }} />
      </Box>
    </Box>
  );
}
