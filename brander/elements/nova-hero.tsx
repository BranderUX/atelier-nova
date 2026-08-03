import { Box, Button, Typography } from "@mui/material";

export interface Props {
  greeting: string;
  subtitle: string;
  campaignTitle: string;
  campaignBody: string;
  ctaLabel: string;
  imageUrl: string;
  onShopNow?: () => void;
}

export default function Component({
  greeting,
  subtitle,
  campaignTitle,
  campaignBody,
  ctaLabel,
  imageUrl,
  onShopNow,
}: Props) {
  const serif = "Georgia, 'Times New Roman', serif";
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        minHeight: { xs: 480, sm: 700 },
        borderRadius: "6px",
        overflow: "hidden",
        bgcolor: "#E9DCC9",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center 20%",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(46,36,29,0.55) 0%, rgba(46,36,29,0.28) 45%, rgba(46,36,29,0.05) 75%)",
        }}
      />
      <Box
        sx={{
          position: "relative",
          height: "100%",
          minHeight: { xs: 480, sm: 700 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          px: { xs: 3, sm: 6 },
          py: { xs: 4, sm: 7 },
          maxWidth: { xs: "100%", sm: "72%" },
        }}
      >
        <Box>
          <Typography
            sx={{
              fontFamily: serif,
              fontSize: { xs: 26, sm: 34 },
              color: "#FBF4E9",
              lineHeight: 1.15,
              textShadow: "0 1px 12px rgba(46,36,29,0.4)",
            }}
          >
            {greeting}
          </Typography>
          <Typography sx={{ mt: 0.75, fontSize: 14.5, color: "rgba(251,244,233,0.85)" }}>
            {subtitle}
          </Typography>
        </Box>
        <Box sx={{ pb: { xs: 0, sm: 1 } }}>
          <Typography
            sx={{
              fontFamily: serif,
              fontSize: { xs: 44, sm: 60 },
              lineHeight: 1.02,
              color: "#FDF8F0",
              textShadow: "0 2px 28px rgba(46,36,29,0.45)",
              whiteSpace: "pre-line",
            }}
          >
            {campaignTitle}
          </Typography>
          <Typography
            sx={{
              mt: 2,
              fontSize: 15,
              color: "rgba(251,244,233,0.92)",
              maxWidth: 320,
              textShadow: "0 1px 8px rgba(46,36,29,0.35)",
            }}
          >
            {campaignBody}
          </Typography>
          <Button
            onClick={() => onShopNow?.()}
            sx={{
              mt: 3,
              px: 3.5,
              py: 1.1,
              bgcolor: "#C06B4A",
              color: "#FDF8F0",
              borderRadius: "3px",
              fontSize: 14.5,
              textTransform: "none",
              boxShadow: "0 4px 16px rgba(46,36,29,0.3)",
              "&:hover": { bgcolor: "#A95A3C", boxShadow: "0 4px 16px rgba(46,36,29,0.3)" },
            }}
          >
            {ctaLabel}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
