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

/** Popovers must not move focus — cross-iframe focus scroll jumps the host page. */
const NO_FOCUS_MENU = {
  autoFocus: false,
  disableAutoFocusItem: true,
  disableAutoFocus: true,
  disableEnforceFocus: true,
  disableRestoreFocus: true,
  disableScrollLock: true,
} as const;

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
        maxWidth: 680,
        mx: "auto",
        bgcolor: "#FFFFFF",
        borderRadius: "8px",
        boxShadow: "0 12px 36px rgba(62,47,40,0.14)",
        p: { xs: 2, sm: 2.5 },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2.5 }}>
        <Box
          sx={{
            flexShrink: 0,
            width: { xs: "100%", sm: 230 },
            height: { xs: 280, sm: 336 },
            borderRadius: "5px",
            backgroundImage: `url(${product.imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center top",
          }}
        />
        <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
          <Typography sx={{ fontFamily: serif, fontSize: 23, color: "#2E241D", lineHeight: 1.15 }}>
            {product.name}
          </Typography>
          <Typography sx={{ mt: 0.25, fontSize: 16, color: "#4E4136" }}>${product.price}</Typography>

          <Typography sx={{ mt: 1.5, fontSize: 12.5, color: "#6E5F52" }}>Size</Typography>
          <Box sx={{ mt: 0.75, display: "flex", gap: 0.75, flexWrap: "wrap" }}>
            {sizes.map((option) => {
              const selected = option === size;
              return (
                <Box
                  key={option}
                  onClick={() => setSize(option)}
                  sx={{
                    minWidth: 40,
                    px: 1,
                    py: 0.6,
                    textAlign: "center",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: 13.5,
                    bgcolor: selected ? "#C06B4A" : "#F4EDE3",
                    color: selected ? "#FDF8F0" : "#3B2E25",
                    transition: "background-color 120ms ease",
                  }}
                >
                  {option}
                </Box>
              );
            })}
          </Box>

          <Select
            value={address}
            onChange={(e) => setAddress(String(e.target.value))}
            fullWidth
            size="small"
            MenuProps={NO_FOCUS_MENU}
            sx={{
              mt: 1.75,
              borderRadius: "20px",
              bgcolor: "#FDF8F0",
              fontSize: 13.5,
              color: "#3B2E25",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#E4D6C2" },
            }}
          >
            {addresses.map((option) => (
              <MenuItem key={option} value={option} sx={{ fontSize: 13.5 }}>
                {option}
              </MenuItem>
            ))}
          </Select>

          <Typography sx={{ mt: 1.25, fontSize: 13.5, color: "#3B2E25" }}>{arrivalText}</Typography>

          {look ? (
            <Box
              onClick={(e) => {
                e.stopPropagation();
                setLookOpen(true);
              }}
              sx={{
                mt: 1.25,
                display: "flex",
                alignItems: "center",
                gap: 1.25,
                p: 1,
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
                      width: 30,
                      height: 38,
                      borderRadius: "3px",
                      border: "2px solid #FBF4E9",
                      ml: index === 0 ? 0 : -1.25,
                      backgroundImage: `url(${item.imageUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center top",
                    }}
                  />
                ))}
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography noWrap sx={{ fontSize: 13, color: "#3B2E25" }}>
                  {look.title || "Complete the look"}
                </Typography>
                <Typography noWrap sx={{ fontSize: 11.5, color: "#8A7B6E" }}>
                  {look.items.length} matching pieces — tap to see
                </Typography>
              </Box>
              <Typography sx={{ fontSize: 16, color: "#B4653F" }}>›</Typography>
            </Box>
          ) : null}

          <Button
            fullWidth
            onClick={() =>
              onPlaceOrder?.({ id: product.id, name: product.name, price: product.price, size, address, arrival: arrivalText })
            }
            sx={{
              mt: "auto",
              pt: 1.1,
              pb: 1.1,
              bgcolor: "#C06B4A",
              color: "#FDF8F0",
              borderRadius: "6px",
              fontSize: 14.5,
              textTransform: "none",
              boxShadow: "none",
              "&:hover": { bgcolor: "#A95A3C", boxShadow: "none" },
            }}
          >
            Place order
          </Button>
        </Box>
      </Box>

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
