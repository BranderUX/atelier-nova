import { Box, Button, Typography } from "@mui/material";

export interface Props {
  title: string;
  arrivalText: string;
  orderId: string;
  onTrackOrder?: () => void;
}

export default function Component({ title, arrivalText, orderId, onTrackOrder }: Props) {
  const serif = "Georgia, 'Times New Roman', serif";
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 460,
        mx: "auto",
        bgcolor: "#FFFFFF",
        borderRadius: "8px",
        boxShadow: "0 16px 44px rgba(62,47,40,0.14)",
        px: { xs: 3, md: 5 },
        py: { xs: 5, md: 7 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Box component="svg" viewBox="0 0 64 64" sx={{ width: 64, height: 64 }}>
        <path
          d="M12 34 L26 48 L52 16"
          fill="none"
          stroke="#3B2E25"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Box>
      <Typography sx={{ mt: 3, fontFamily: serif, fontSize: { xs: 32, md: 40 }, color: "#2E241D" }}>
        {title}
      </Typography>
      <Typography sx={{ mt: 1, fontSize: 16, color: "#6E5F52" }}>{arrivalText}</Typography>
      <Typography sx={{ mt: 1.5, fontSize: 13, letterSpacing: "0.06em", color: "#9C8D7F" }}>
        Order {orderId}
      </Typography>
      <Button
        onClick={() => onTrackOrder?.()}
        sx={{
          mt: { xs: 4, md: 6 },
          px: 5,
          py: 1.25,
          border: "1px solid #3B2E25",
          color: "#3B2E25",
          bgcolor: "transparent",
          borderRadius: "24px",
          fontSize: 15,
          textTransform: "none",
          "&:hover": { bgcolor: "#F4EDE3" },
        }}
      >
        Track order
      </Button>
    </Box>
  );
}
