import { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";

interface Piece {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  owned?: boolean;
}

export interface Props {
  title?: string;
  provenance?: string;
  /** Pre-rendered try-on images keyed `${baseId}--${layerId}` (layerId "none" = no layer). */
  figureMap: Record<string, string>;
  bases: Piece[];
  layers: Piece[];
  initialBaseId: string;
  onOrderLook?: (look: { lookNames: string; baseId: string; layerId: string; total: number }) => void;
  onItemContextMenu?: (event: React.MouseEvent, item: Piece) => void;
}

const serif = "Georgia, 'Times New Roman', serif";

export default function Component({
  title,
  provenance,
  figureMap,
  bases,
  layers,
  initialBaseId,
  onOrderLook,
  onItemContextMenu,
}: Props) {
  const [baseId, setBaseId] = useState(initialBaseId);
  const [layerId, setLayerId] = useState("none");
  const [dragOver, setDragOver] = useState(false);
  useEffect(() => setBaseId(initialBaseId), [initialBaseId]);

  const figure = figureMap[`${baseId}--${layerId}`] || figureMap[`${baseId}--none`];
  const base = bases.find((b) => b.id === baseId);
  const layer = layers.find((l) => l.id === layerId);
  const selected = [base, layer].filter((p): p is Piece => Boolean(p));
  const total = selected.filter((p) => !p.owned).reduce((sum, p) => sum + p.price, 0);

  const wear = (piece: Piece, kind: "base" | "layer") => {
    if (kind === "base") setBaseId(piece.id);
    else setLayerId(layerId === piece.id ? "none" : piece.id);
  };

  const cardRow = (piece: Piece, kind: "base" | "layer", active: boolean) => (
    <Box
      key={piece.id}
      draggable
      onDragStart={(e) => e.dataTransfer.setData("text/plain", `${kind}:${piece.id}`)}
      onClick={() => wear(piece, kind)}
      onContextMenu={(e) => {
        e.preventDefault();
        onItemContextMenu?.(e, piece);
      }}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.25,
        p: 1,
        borderRadius: "6px",
        bgcolor: "#FFFFFF",
        cursor: "grab",
        border: active ? "2px solid #C06B4A" : "2px solid transparent",
        boxShadow: active ? "0 4px 14px rgba(192,107,74,0.25)" : "0 2px 8px rgba(62,47,40,0.08)",
        transition: "border-color 120ms ease, box-shadow 120ms ease",
      }}
    >
      <Box
        sx={{
          width: 44,
          height: 56,
          flexShrink: 0,
          borderRadius: "4px",
          backgroundImage: `url(${piece.imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      />
      <Box sx={{ minWidth: 0 }}>
        <Typography noWrap sx={{ fontSize: 12, letterSpacing: "0.05em", textTransform: "uppercase", color: "#3B2E25" }}>
          {piece.name}
        </Typography>
        {piece.owned ? (
          <Box sx={{ mt: 0.25, display: "inline-block", bgcolor: "#EAF0E2", color: "#5A6B4A", borderRadius: "3px", px: 0.75, fontSize: 11 }}>
            You own this
          </Box>
        ) : (
          <Typography sx={{ fontSize: 12.5, color: "#8A7B6E" }}>${piece.price}</Typography>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ width: "100%", bgcolor: "#FBF4E9", borderRadius: "8px", boxShadow: "0 12px 36px rgba(62,47,40,0.12)", p: { xs: 2, md: 3 } }}>
      {title ? (
        <Box sx={{ mb: 2, display: "flex", alignItems: "baseline", flexWrap: "wrap", gap: 1.25 }}>
          <Typography sx={{ fontFamily: serif, fontSize: { xs: 22, md: 26 }, color: "#2E241D" }}>
            {title}
          </Typography>
          {provenance ? (
            <Box
              sx={{
                bgcolor: "#EFE5D3",
                color: "#8A7B6E",
                borderRadius: "999px",
                px: 1.25,
                py: 0.3,
                fontSize: 11.5,
              }}
            >
              {provenance}
            </Box>
          ) : null}
        </Box>
      ) : null}
      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2.5 }}>
        <Box
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const [kind, id] = e.dataTransfer.getData("text/plain").split(":");
            const piece =
              kind === "base" ? bases.find((b) => b.id === id) : layers.find((l) => l.id === id);
            if (piece) wear(piece, kind === "base" ? "base" : "layer");
          }}
          sx={{
            flex: "0 0 auto",
            width: { xs: "100%", md: 380 },
            aspectRatio: "3 / 4",
            borderRadius: "6px",
            overflow: "hidden",
            position: "relative",
            outline: dragOver ? "3px dashed #C06B4A" : "3px dashed transparent",
            outlineOffset: -3,
            transition: "outline-color 120ms ease",
          }}
        >
          <Box
            component="img"
            src={figure}
            alt="Try-on preview"
            sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          <Box sx={{ position: "absolute", left: 10, bottom: 10, bgcolor: "rgba(46,42,38,0.75)", color: "#F7F1E8", borderRadius: "4px", px: 1.25, py: 0.5, fontSize: 12 }}>
            {selected.map((p) => p.name).join(" + ") || "Pick a piece"}
          </Box>
        </Box>

        <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography sx={{ fontSize: 12.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8A7B6E" }}>
            Layers — drag onto her or tap
          </Typography>
          {layers.map((piece) => cardRow(piece, "layer", piece.id === layerId))}
          <Typography sx={{ mt: 1, fontSize: 12.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8A7B6E" }}>
            Base outfit
          </Typography>
          {bases.map((piece) => cardRow(piece, "base", piece.id === baseId))}
          <Button
            onClick={() =>
              onOrderLook?.({
                lookNames: selected.map((p) => p.name).join(", "),
                baseId,
                layerId,
                total,
              })
            }
            sx={{
              mt: "auto",
              alignSelf: "stretch",
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
            {total > 0 ? `Order this look — $${total}` : "Order this look"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
