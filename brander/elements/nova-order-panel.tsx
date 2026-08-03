import { useEffect, useState } from "react";
import { Box, Button, MenuItem, Select, Typography } from "@mui/material";

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
  const [view, setView] = useState<"order" | "look">("order");
  useEffect(() => setSize(preselectedSize), [preselectedSize]);
  useEffect(() => setAddress(preselectedAddress), [preselectedAddress]);

  const look = completeTheLook?.items?.length ? completeTheLook : undefined;
  const lookTotal = look ? look.items.reduce((sum, item) => sum + item.price, 0) + product.price : 0;

  const placeSingle = () =>
    onPlaceOrder?.({ id: product.id, name: product.name, price: product.price, size, address, arrival: arrivalText });

  const tile = (imageUrl: string, name: string, priceLabel: string) => (
    <Box key={name} sx={{ flex: 1, minWidth: 0, bgcolor: "#FFFFFF", borderRadius: "6px", overflow: "hidden", border: "1px solid #F0E6D6" }}>
      <Box
        sx={{
          width: "100%",
          // Product shots are 800x1066 — matching the ratio means no crop.
          aspectRatio: "3 / 4",
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Box sx={{ px: 0.75, py: 0.6, textAlign: "center" }}>
        <Typography noWrap sx={{ fontSize: 10, letterSpacing: "0.05em", textTransform: "uppercase", color: "#3B2E25" }}>
          {name}
        </Typography>
        <Typography sx={{ fontSize: 11.5, color: "#8A7B6E" }}>{priceLabel}</Typography>
      </Box>
    </Box>
  );

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
      {view === "order" ? (
        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2.5 }}>
          <Box
            sx={{
              flexShrink: 0,
              width: { xs: "100%", sm: 230 },
              height: { xs: 280, sm: 320 },
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
                onClick={() => setView("look")}
                sx={{
                  mt: 1.25,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  p: 0.75,
                  borderRadius: "6px",
                  border: "1px dashed #E0CDB4",
                  bgcolor: "#FDF8F0",
                  cursor: "pointer",
                  transition: "background-color 120ms ease",
                  "&:hover": { bgcolor: "#F7EDDD" },
                }}
              >
                <Box sx={{ display: "flex", gap: 0.5 }}>
                  {look.items.slice(0, 3).map((item) => (
                    <Box
                      key={item.id}
                      sx={{
                        width: 30,
                        aspectRatio: "3 / 4",
                        borderRadius: "3px",
                        backgroundImage: `url(${item.imageUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                  ))}
                </Box>
                <Typography sx={{ flex: 1, fontSize: 12.5, color: "#6E5F52" }}>
                  {look.title || "Complete the look"}
                </Typography>
                <Typography sx={{ fontSize: 14, color: "#B4653F" }}>›</Typography>
              </Box>
            ) : null}

            <Button
              fullWidth
              onClick={placeSingle}
              sx={{
                mt: "auto",
                py: 1.1,
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
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", textAlign: "center" }}>
          <Typography sx={{ fontFamily: serif, fontSize: 22, color: "#2E241D" }}>
            {look?.title || "Make it a look?"}
          </Typography>
          {look?.note ? (
            <Typography sx={{ mt: 0.5, fontSize: 12.5, color: "#8A7B6E" }}>{look.note}</Typography>
          ) : null}
          <Box sx={{ mt: 1.75, display: "flex", gap: 1, alignItems: "stretch" }}>
            {tile(product.imageUrl, product.name, "in your order")}
            <Box sx={{ alignSelf: "center", px: 0.25, fontSize: 18, color: "#B4653F" }}>+</Box>
            {(look?.items || []).slice(0, 3).map((item) => tile(item.imageUrl, item.name, `$${item.price}`))}
          </Box>
          <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
            <Button
              onClick={placeSingle}
              sx={{
                flex: 1,
                py: 1,
                color: "#5C4F43",
                border: "1px solid #E4D6C2",
                borderRadius: "6px",
                fontSize: 13,
                textTransform: "none",
              }}
            >
              Just the {product.name}
            </Button>
            <Button
              onClick={() =>
                onAddCompleteLook?.({
                  baseProductId: product.id,
                  bundleNames: (look?.items || []).map((item) => item.name).join(", "),
                  itemCount: look?.items.length || 0,
                  total: lookTotal,
                })
              }
              sx={{
                flex: 1.3,
                py: 1,
                bgcolor: "#C06B4A",
                color: "#FDF8F0",
                borderRadius: "6px",
                fontSize: 13.5,
                textTransform: "none",
                boxShadow: "none",
                "&:hover": { bgcolor: "#A95A3C", boxShadow: "none" },
              }}
            >
              {`Order the full look — $${lookTotal}`}
            </Button>
          </Box>
          <Button
            onClick={() => setView("order")}
            sx={{ mt: 0.75, alignSelf: "center", color: "#8A7B6E", fontSize: 12, textTransform: "none" }}
          >
            ← Back
          </Button>
        </Box>
      )}
    </Box>
  );
}
