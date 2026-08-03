import { Box, Button, Typography } from "@mui/material";

interface LookItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

export interface Props {
  title: string;
  items: LookItem[];
  bundleNote?: string;
  ctaLabel: string;
  onSelectItem?: (item: LookItem) => void;
  onShopBundle?: () => void;
  onItemContextMenu?: (event: React.MouseEvent, item: LookItem) => void;
}

export default function Component({
  title,
  items,
  bundleNote,
  ctaLabel,
  onSelectItem,
  onShopBundle,
  onItemContextMenu,
}: Props) {
  const serif = "Georgia, 'Times New Roman', serif";
  const garments = items.slice(0, 3);
  const extras = items.slice(3);
  const total = items.reduce((sum, item) => sum + item.price, 0);

  const renderItem = (item: LookItem, height: number) => (
    <Box
      key={item.id}
      onClick={(e) => {
        e.stopPropagation();
        onSelectItem?.(item);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        onItemContextMenu?.(e, item);
      }}
      sx={{ cursor: "pointer", textAlign: "center", flex: 1, minWidth: 0 }}
    >
      <Box
        sx={{
          width: "100%",
          height,
          borderRadius: "4px",
          backgroundImage: `url(${item.imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      />
      <Typography
        noWrap
        sx={{ mt: 0.75, fontSize: 11.5, letterSpacing: "0.06em", textTransform: "uppercase", color: "#5C4F43" }}
      >
        {item.name}
      </Typography>
      <Typography sx={{ fontSize: 12.5, color: "#8A7B6E" }}>${item.price}</Typography>
    </Box>
  );

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 380,
        mx: "auto",
        bgcolor: "#FBF4E9",
        borderRadius: "8px",
        boxShadow: "0 12px 36px rgba(62,47,40,0.12)",
        p: { xs: 2.5, md: 3 },
        textAlign: "center",
      }}
    >
      <Typography sx={{ fontFamily: serif, fontSize: { xs: 26, md: 30 }, color: "#2E241D" }}>
        {title}
      </Typography>
      <Box sx={{ mt: 2, bgcolor: "#FFFFFF", borderRadius: "6px", p: 1.75 }}>
        <Box sx={{ display: "flex", gap: 1.25 }}>{garments.map((item) => renderItem(item, 150))}</Box>
        {extras.length ? (
          <Box sx={{ mt: 1.5, display: "flex", gap: 1.25, justifyContent: "center" }}>
            {extras.map((item) => renderItem(item, 96))}
          </Box>
        ) : null}
      </Box>
      {bundleNote ? (
        <Box
          sx={{
            mt: 1.75,
            display: "inline-block",
            bgcolor: "#F3E7D2",
            borderRadius: "4px",
            px: 1.5,
            py: 0.5,
            fontSize: 12.5,
            color: "#5C4F43",
          }}
        >
          {bundleNote}
        </Box>
      ) : null}
      <Typography sx={{ mt: 1.5, fontSize: 13.5, color: "#8A7B6E" }}>
        Bundle total ${total}
      </Typography>
      <Button
        fullWidth
        onClick={() => onShopBundle?.()}
        sx={{
          mt: 1.5,
          py: 1.25,
          bgcolor: "#C06B4A",
          color: "#FDF8F0",
          borderRadius: "5px",
          fontSize: 15,
          textTransform: "none",
          boxShadow: "none",
          "&:hover": { bgcolor: "#A95A3C", boxShadow: "none" },
        }}
      >
        {ctaLabel}
      </Button>
    </Box>
  );
}
