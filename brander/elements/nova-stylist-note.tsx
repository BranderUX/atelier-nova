import { Box, Typography } from "@mui/material";

export interface Props {
  title?: string;
  bodyText: string;
  careIcons?: string[];
  thumbnailUrl?: string;
  metaLine?: string;
  footerHighlight?: string;
  productId?: string;
  productName?: string;
  onViewProduct?: () => void;
}

const ICON_PATHS: Record<string, string> = {
  "machine-wash-cold": "M3 6h18l-2 13H5L3 6Zm3 6c2 1.5 4 1.5 6 0s4-1.5 6 0M9 3v3m6-3v3",
  "hand-wash": "M3 6h18l-2 13H5L3 6Zm5 6h8m-8 3h8",
  "no-bleach": "M12 4 21 19H3L12 4Zm-6 15L19 6",
  "line-dry": "M4 5h16v14H4V5Zm0 0c4 6 12 6 16 0",
  "iron-low": "M5 17h15c0-6-4-9-9-9H8l-3 9Zm7-4h.01",
  "dry-clean": "M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16Z",
};

export default function Component({
  title,
  bodyText,
  careIcons,
  thumbnailUrl,
  metaLine,
  footerHighlight,
  productName,
  onViewProduct,
}: Props) {
  const serif = "Georgia, 'Times New Roman', serif";
  const compact = Boolean(thumbnailUrl && !careIcons?.length);

  if (compact) {
    return (
      <Box
        onClick={() => onViewProduct?.()}
        sx={{
          width: "100%",
          maxWidth: 460,
          mx: "auto",
          display: "flex",
          gap: 1.75,
          alignItems: "center",
          bgcolor: "#FBF4E9",
          borderRadius: "6px",
          boxShadow: "0 8px 24px rgba(62,47,40,0.12)",
          p: 1.5,
          cursor: onViewProduct ? "pointer" : "default",
        }}
      >
        <Box
          sx={{
            width: 72,
            height: 88,
            flexShrink: 0,
            borderRadius: "4px",
            backgroundImage: `url(${thumbnailUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center top",
          }}
        />
        <Box>
          <Typography sx={{ fontSize: 15.5, color: "#3B2E25", lineHeight: 1.35 }}>{bodyText}</Typography>
          {metaLine ? (
            <Typography sx={{ mt: 0.5, fontSize: 12.5, color: "#8A7B6E" }}>{metaLine}</Typography>
          ) : null}
          {productName ? (
            <Typography sx={{ mt: 0.5, fontSize: 12.5, color: "#B4653F" }}>{productName}</Typography>
          ) : null}
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 520,
        mx: "auto",
        bgcolor: "#FBF4E9",
        borderRadius: "8px",
        boxShadow: "0 14px 40px rgba(62,47,40,0.16)",
        overflow: "hidden",
        textAlign: "center",
      }}
    >
      <Box sx={{ px: { xs: 3, md: 5 }, pt: 4, pb: 3 }}>
        {title ? (
          <Typography sx={{ fontFamily: serif, fontSize: { xs: 24, md: 30 }, color: "#2E241D" }}>
            {title}
          </Typography>
        ) : null}
        {careIcons?.length ? (
          <Box sx={{ mt: 2.5, display: "flex", justifyContent: "center", gap: 3 }}>
            {careIcons.map((icon) =>
              ICON_PATHS[icon] ? (
                <Box key={icon} component="svg" viewBox="0 0 24 24" sx={{ width: 34, height: 34 }}>
                  <path
                    d={ICON_PATHS[icon]}
                    fill="none"
                    stroke="#3B2E25"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Box>
              ) : null
            )}
          </Box>
        ) : null}
        <Typography
          sx={{ mt: 2.5, fontSize: 16, lineHeight: 1.55, color: "#4E4136", whiteSpace: "pre-line" }}
        >
          {bodyText}
        </Typography>
      </Box>
      {footerHighlight ? (
        <Box
          sx={{
            borderTop: "1px solid #E2CFA9",
            bgcolor: "#FDF8EE",
            px: 3,
            py: 1.75,
            boxShadow: "inset 0 1px 0 #F3E3C2",
          }}
        >
          <Typography sx={{ fontSize: 15.5, color: "#3B2E25" }}>{footerHighlight}</Typography>
        </Box>
      ) : null}
    </Box>
  );
}
