import { Box, Tooltip, Typography } from "@mui/material";

interface GridProduct {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  imageUrl: string;
  badge?: string;
  badgeReason?: string;
  sizeChip?: string;
}

export interface Props {
  products: GridProduct[];
  columns?: number;
  onSelectProduct?: (product: GridProduct) => void;
  onItemContextMenu?: (event: React.MouseEvent, item: GridProduct) => void;
}

export default function Component({ products, columns, onSelectProduct, onItemContextMenu }: Props) {
  const cols = columns && columns >= 2 && columns <= 5 ? columns : 4;
  return (
    <Box
      sx={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: `repeat(${cols}, 1fr)` },
        gap: 2,
      }}
    >
      {products.map((product) => (
        <Box
          key={product.id}
          onClick={() => onSelectProduct?.(product)}
          onContextMenu={(e) => {
            e.preventDefault();
            onItemContextMenu?.(e, product);
          }}
          sx={{
            position: "relative",
            bgcolor: "#FFFFFF",
            borderRadius: "4px",
            overflow: "hidden",
            cursor: "pointer",
            transition: "transform 160ms ease, box-shadow 160ms ease",
            "&:hover": { transform: "translateY(-3px)", boxShadow: "0 10px 28px rgba(62,47,40,0.14)" },
          }}
        >
          <Box
            sx={{
              width: "100%",
              aspectRatio: "3 / 3.6",
              backgroundImage: `url(${product.imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center top",
            }}
          />
          {product.badge ? (
            <Tooltip
              title={product.badgeReason || ""}
              arrow
              placement="bottom"
              disableHoverListener={!product.badgeReason}
              componentsProps={{
                tooltip: {
                  sx: (theme) => ({
                    bgcolor: "#FBF4E9",
                    color: "#3B2E25",
                    border: "1px solid #E4D6C2",
                    boxShadow: "0 8px 24px rgba(62,47,40,0.16)",
                    fontFamily: theme.typography.fontFamily,
                    borderRadius: `${theme.shape.borderRadius}px`,
                    fontSize: 12.5,
                    px: 1.5,
                    py: 1,
                    maxWidth: 220,
                    "& .MuiTooltip-arrow": { color: "#FBF4E9" },
                  }),
                },
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: 120,
                  height: 120,
                  overflow: "hidden",
                  pointerEvents: "auto",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: 32,
                    right: -34,
                    width: 160,
                    transform: "rotate(45deg)",
                    bgcolor: "#B4653F",
                    color: "#FBF4EA",
                    fontSize: 10.5,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    textAlign: "center",
                    py: 0.5,
                    boxShadow: "0 2px 8px rgba(62,47,40,0.25)",
                  }}
                >
                  {product.badge}
                </Box>
              </Box>
            </Tooltip>
          ) : null}
          <Box sx={{ px: 1.25, py: 1.25, textAlign: "center" }}>
            <Typography
              noWrap
              sx={{
                fontSize: 11.5,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                color: "#3B2E25",
              }}
            >
              {product.name}
            </Typography>
            <Box sx={{ mt: 0.4, display: "flex", justifyContent: "center", gap: 0.75, alignItems: "baseline" }}>
              {product.salePrice ? (
                <Typography sx={{ fontSize: 12, color: "#9C8D7F", textDecoration: "line-through" }}>
                  ${product.price}
                </Typography>
              ) : null}
              <Typography sx={{ fontSize: 13.5, color: "#3B2E25" }}>
                ${product.salePrice ?? product.price}
              </Typography>
            </Box>
            {product.sizeChip ? (
              <Box
                sx={{
                  mt: 0.6,
                  display: "inline-block",
                  bgcolor: "#F1E8DC",
                  borderRadius: "3px",
                  px: 1,
                  py: 0.2,
                  fontSize: 11,
                  color: "#5C4F43",
                }}
              >
                {product.sizeChip}
              </Box>
            ) : null}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
