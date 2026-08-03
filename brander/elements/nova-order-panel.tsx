import { useEffect, useState } from "react";
import { Box, Button, Dialog, MenuItem, Select, Typography } from "@mui/material";

interface PanelProduct {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

interface LookItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

export interface Props {
  product: PanelProduct;
  sizes: string[];
  preselectedSize: string;
  addresses: string[];
  preselectedAddress: string;
  arrivalText: string;
  completeTheLook?: { title?: string; note?: string; items: LookItem[] };
  onPlaceOrder?: (order: {
    id: string;
    name: string;
    price: number;
    size: string;
    address: string;
    arrival: string;
  }) => void;
  onAddCompleteLook?: (bundle: {
    baseProductId: string;
    bundleNames: string;
    itemCount: number;
    total: number;
  }) => void;
}

const serif = "Georgia, 'Times New Roman', serif";

export default function Component({
  product,
  sizes,
  preselectedSize,
  addresses,
  preselectedAddress,
  arrivalText,
  completeTheLook,
  onPlaceOrder,
  onAddCompleteLook,
}: Props) {
  const [size, setSize] = useState(preselectedSize);
  const [address, setAddress] = useState(preselectedAddress);
  const [lookOpen, setLookOpen] = useState(false);
  useEffect(() => setSize(preselectedSize), [preselectedSize]);
  useEffect(() => setAddress(preselectedAddress), [preselectedAddress]);

  const look = completeTheLook?.items?.length ? completeTheLook : undefined;
  const lookTotal = look ? look.items.reduce((sum, item) => sum + item.price, 0) + product.price : 0;

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 440,
        mx: "auto",
        bgcolor: "#FFFFFF",
        borderRadius: "8px",
        boxShadow: "0 16px 44px rgba(62,47,40,0.16)",
        p: { xs: 2.5, md: 3.5 },
      }}
    >
      <Box
        sx={{
          width: "100%",
          aspectRatio: "4 / 4.6",
          borderRadius: "5px",
          backgroundImage: `url(${product.imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      />
      <Typography sx={{ mt: 2.5, fontFamily: serif, fontSize: 26, color: "#2E241D" }}>
        {product.name}
      </Typography>
      <Typography sx={{ mt: 0.5, fontSize: 17, color: "#4E4136" }}>${product.price}</Typography>

      <Typography sx={{ mt: 2.5, fontSize: 14, color: "#6E5F52" }}>Size</Typography>
      <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
        {sizes.map((option) => (
          <Box
            key={option}
            onClick={() => setSize(option)}
            sx={{
              minWidth: 46,
              px: 1.25,
              py: 1,
              textAlign: "center",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: 14.5,
              bgcolor: option === size ? "#C06B4A" : "#F4EDE3",
              color: option === size ? "#FDF8F0" : "#3B2E25",
              transition: "background-color 120ms ease",
            }}
          >
            {option}
          </Box>
        ))}
      </Box>

      <Select
        value={address}
        onChange={(e) => setAddress(String(e.target.value))}
        fullWidth
        MenuProps={{
          // The element renders in a content-sized sandbox iframe: any focus
          // move inside the popover makes the BROWSER scroll the host page to
          // bring the focused node into view (cross-frame focus scroll) — the
          // whole screen "slides up". Disable the Modal focus dance entirely.
          autoFocus: false,
          disableAutoFocusItem: true,
          disableAutoFocus: true,
          disableEnforceFocus: true,
          disableRestoreFocus: true,
          disableScrollLock: true,
        }}
        sx={{
          mt: 2.5,
          borderRadius: "24px",
          bgcolor: "#FDF8F0",
          fontSize: 14.5,
          color: "#3B2E25",
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#E4D6C2" },
        }}
      >
        {addresses.map((option) => (
          <MenuItem key={option} value={option} sx={{ fontSize: 14.5 }}>
            {option}
          </MenuItem>
        ))}
      </Select>

      <Typography sx={{ mt: 2, fontSize: 15, color: "#3B2E25" }}>{arrivalText}</Typography>

      {look ? (
        <Box
          onClick={(e) => {
            e.stopPropagation();
            setLookOpen(true);
          }}
          sx={{
            mt: 2.5,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            p: 1.25,
            borderRadius: "6px",
            bgcolor: "#FBF4E9",
            cursor: "pointer",
            "&:hover": { bgcolor: "#F3E7D2" },
          }}
        >
          <Box sx={{ display: "flex" }}>
            {look.items.slice(0, 3).map((item, index) => (
              <Box
                key={item.id}
                sx={{
                  width: 40,
                  height: 48,
                  borderRadius: "4px",
                  border: "2px solid #FBF4E9",
                  ml: index === 0 ? 0 : -1.5,
                  backgroundImage: `url(${item.imageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center top",
                }}
              />
            ))}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: 14, color: "#3B2E25" }}>
              {look.title || "Complete the look"}
            </Typography>
            <Typography sx={{ fontSize: 12.5, color: "#8A7B6E" }}>
              {look.items.length} matching pieces — tap to see
            </Typography>
          </Box>
          <Typography sx={{ fontSize: 18, color: "#B4653F" }}>›</Typography>
        </Box>
      ) : null}

      <Button
        fullWidth
        onClick={() =>
          onPlaceOrder?.({ id: product.id, name: product.name, price: product.price, size, address, arrival: arrivalText })
        }
        sx={{
          mt: 2.5,
          py: 1.4,
          bgcolor: "#C06B4A",
          color: "#FDF8F0",
          borderRadius: "6px",
          fontSize: 15.5,
          textTransform: "none",
          boxShadow: "none",
          "&:hover": { bgcolor: "#A95A3C", boxShadow: "none" },
        }}
      >
        Place order
      </Button>

      {look ? (
        <Dialog
          open={lookOpen}
          onClose={() => setLookOpen(false)}
          fullWidth
          maxWidth="sm"
          disableAutoFocus
          disableEnforceFocus
          disableRestoreFocus
          disableScrollLock
          PaperProps={{ sx: { bgcolor: "#FBF4E9", borderRadius: "10px", p: { xs: 2, md: 3 } } }}
        >
          <Typography sx={{ fontFamily: serif, fontSize: 28, color: "#2E241D", textAlign: "center" }}>
            {look.title || "Complete the look"}
          </Typography>
          {look.note ? (
            <Typography sx={{ mt: 0.75, fontSize: 13.5, color: "#8A7B6E", textAlign: "center" }}>
              {look.note}
            </Typography>
          ) : null}
          <Box sx={{ mt: 2, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 1.5 }}>
            {look.items.map((item) => (
              <Box key={item.id} sx={{ bgcolor: "#FFFFFF", borderRadius: "6px", overflow: "hidden" }}>
                <Box
                  sx={{
                    width: "100%",
                    aspectRatio: "4 / 4",
                    backgroundImage: `url(${item.imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center top",
                  }}
                />
                <Box sx={{ px: 1.25, py: 1, textAlign: "center" }}>
                  <Typography noWrap sx={{ fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", color: "#3B2E25" }}>
                    {item.name}
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: "#8A7B6E" }}>${item.price}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
          <Button
            fullWidth
            onClick={() => {
              setLookOpen(false);
              onAddCompleteLook?.({
                baseProductId: product.id,
                bundleNames: look.items.map((item) => item.name).join(", "),
                itemCount: look.items.length,
                total: lookTotal,
              });
            }}
            sx={{
              mt: 2,
              py: 1.3,
              bgcolor: "#C06B4A",
              color: "#FDF8F0",
              borderRadius: "6px",
              fontSize: 15,
              textTransform: "none",
              boxShadow: "none",
              "&:hover": { bgcolor: "#A95A3C", boxShadow: "none" },
            }}
          >
            {`Add the complete look — $${lookTotal}`}
          </Button>
          <Button
            fullWidth
            onClick={() => setLookOpen(false)}
            sx={{ mt: 1, py: 1, color: "#5C4F43", fontSize: 13.5, textTransform: "none" }}
          >
            Just the {product.name}
          </Button>
        </Dialog>
      ) : null}
    </Box>
  );
}
