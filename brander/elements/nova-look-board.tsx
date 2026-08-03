import { Box, Button, Typography } from "@mui/material";

interface LookItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  owned?: boolean;
}

interface Look {
  id: string;
  title: string;
  note?: string;
  items: LookItem[];
}

export interface Props {
  looks: Look[];
  contextNote?: string;
  ctaLabel?: string;
  onSelectItem?: (item: LookItem) => void;
  onShopCapsule?: (capsule: { itemNames: string; itemCount: number; total: number }) => void;
  onItemContextMenu?: (event: React.MouseEvent, item: LookItem) => void;
}

const serif = "Georgia, 'Times New Roman', serif";

export default function Component({
  looks,
  contextNote,
  ctaLabel,
  onSelectItem,
  onShopCapsule,
  onItemContextMenu,
}: Props) {
  const missing = new Map<string, LookItem>();
  looks.forEach((look) =>
    look.items.forEach((item) => {
      if (!item.owned && !missing.has(item.id)) missing.set(item.id, item);
    })
  );
  const missingItems = [...missing.values()];
  const total = missingItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "#FBF4E9",
        borderRadius: "8px",
        boxShadow: "0 12px 36px rgba(62,47,40,0.12)",
        p: { xs: 2, md: 3 },
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: `repeat(${Math.min(looks.length, 4)}, 1fr)` },
          gap: 2,
        }}
      >
        {looks.slice(0, 4).map((look) => (
          <Box key={look.id} sx={{ bgcolor: "#FFFFFF", borderRadius: "6px", p: 1.75 }}>
            <Typography sx={{ fontFamily: serif, fontSize: 18, color: "#2E241D" }}>
              {look.title}
            </Typography>
            {look.note ? (
              <Typography sx={{ mt: 0.25, fontSize: 12, color: "#8A7B6E", lineHeight: 1.4 }}>
                {look.note}
              </Typography>
            ) : null}
            <Box sx={{ mt: 1.5, display: "flex", flexDirection: "column", gap: 1.25 }}>
              {look.items.map((item) => (
                <Box
                  key={`${look.id}-${item.id}`}
                  onClick={() => onSelectItem?.(item)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    onItemContextMenu?.(e, item);
                  }}
                  sx={{ display: "flex", alignItems: "center", gap: 1.25, cursor: "pointer" }}
                >
                  <Box
                    sx={{
                      width: 52,
                      height: 64,
                      flexShrink: 0,
                      borderRadius: "4px",
                      backgroundImage: `url(${item.imageUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center top",
                    }}
                  />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      noWrap
                      sx={{
                        fontSize: 12,
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                        color: "#3B2E25",
                      }}
                    >
                      {item.name}
                    </Typography>
                    {item.owned ? (
                      <Box
                        sx={{
                          mt: 0.25,
                          display: "inline-block",
                          bgcolor: "#EAF0E2",
                          color: "#5A6B4A",
                          borderRadius: "3px",
                          px: 0.75,
                          py: 0.1,
                          fontSize: 11,
                        }}
                      >
                        You own this
                      </Box>
                    ) : (
                      <Typography sx={{ fontSize: 12.5, color: "#8A7B6E" }}>${item.price}</Typography>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          mt: 2,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
        }}
      >
        <Typography sx={{ fontSize: 13.5, color: "#5C4F43" }}>
          {contextNote || `${missingItems.length} pieces to add — the rest is already in your wardrobe.`}
        </Typography>
        <Button
          onClick={() =>
            onShopCapsule?.({
              itemNames: missingItems.map((item) => item.name).join(", "),
              itemCount: missingItems.length,
              total,
            })
          }
          sx={{
            px: 3,
            py: 1.1,
            bgcolor: "#C06B4A",
            color: "#FDF8F0",
            borderRadius: "5px",
            fontSize: 14.5,
            textTransform: "none",
            boxShadow: "none",
            "&:hover": { bgcolor: "#A95A3C", boxShadow: "none" },
          }}
        >
          {ctaLabel || `Add the missing pieces — $${total}`}
        </Button>
      </Box>
    </Box>
  );
}
