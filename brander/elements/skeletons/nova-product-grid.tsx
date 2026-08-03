import { Box, Skeleton } from "@mui/material";

export default function SkeletonComponent() {
  return (
    <Box
      sx={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
        gap: 2,
      }}
    >
      {[0, 1, 2, 3].map((i) => (
        <Box key={i} sx={{ borderRadius: "4px", overflow: "hidden" }}>
          <Skeleton variant="rectangular" width="100%" height={240} />
          <Box sx={{ py: 1.25, display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
            <Skeleton variant="text" width="70%" height={16} />
            <Skeleton variant="text" width="30%" height={16} />
          </Box>
        </Box>
      ))}
    </Box>
  );
}
