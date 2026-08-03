import { Box, Typography } from "@mui/material";

interface EditorialLook {
  id: string;
  title: string;
  caption: string;
  imageUrl: string;
  priceLabel?: string;
}

export interface Props {
  headline?: string;
  subtitle?: string;
  looks: EditorialLook[];
  onSelectLook?: (look: EditorialLook) => void;
  onItemContextMenu?: (event: React.MouseEvent, look: EditorialLook) => void;
}

const serif = "Georgia, 'Times New Roman', serif";

export default function Component({ headline, subtitle, looks, onSelectLook, onItemContextMenu }: Props) {
  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "#FBF4E9",
        borderRadius: "8px",
        boxShadow: "0 12px 36px rgba(62,47,40,0.12)",
        p: { xs: 2, sm: 3 },
      }}
    >
      {headline ? (
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ fontFamily: serif, fontSize: 26, color: "#2E241D", lineHeight: 1.15 }}>
            {headline}
          </Typography>
          {subtitle ? (
            <Typography sx={{ mt: 0.5, fontSize: 13, color: "#8A7B6E" }}>{subtitle}</Typography>
          ) : null}
        </Box>
      ) : null}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: `repeat(${Math.min(looks.length, 3)}, 1fr)` },
          gap: 2,
        }}
      >
        {looks.slice(0, 3).map((look) => (
          <Box
            key={look.id}
            onClick={() => onSelectLook?.(look)}
            onContextMenu={(e) => {
              e.preventDefault();
              onItemContextMenu?.(e, look);
            }}
            sx={{
              position: "relative",
              borderRadius: "6px",
              overflow: "hidden",
              cursor: "pointer",
              // Hover motion stays INSIDE the card (image zoom under
              // overflow:hidden) — nothing moves at the element bounds.
              "&:hover .look-photo": { transform: "scale(1.04)" },
            }}
          >
            <Box
              className="look-photo"
              sx={{
                width: "100%",
                // The try-on shots are 800x1071 — native ratio, no crop.
                aspectRatio: "3 / 4",
                backgroundImage: `url(${look.imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                transition: "transform 400ms ease",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                pt: 6,
                px: 2,
                pb: 1.75,
                background: "linear-gradient(180deg, rgba(30,23,18,0) 0%, rgba(30,23,18,0.72) 100%)",
              }}
            >
              <Typography sx={{ fontFamily: serif, fontSize: 21, color: "#FDF8F0", lineHeight: 1.15 }}>
                {look.title}
              </Typography>
              <Typography sx={{ mt: 0.4, fontSize: 12.5, color: "rgba(253,248,240,0.85)", lineHeight: 1.35 }}>
                {look.caption}
              </Typography>
              {look.priceLabel ? (
                <Box
                  sx={{
                    mt: 1,
                    display: "inline-block",
                    bgcolor: "rgba(251,244,233,0.92)",
                    color: "#3B2E25",
                    borderRadius: "4px",
                    px: 1,
                    py: 0.4,
                    fontSize: 12,
                  }}
                >
                  {look.priceLabel}
                </Box>
              ) : null}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
