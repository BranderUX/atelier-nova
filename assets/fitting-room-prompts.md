# Fitting-room figure map — Higgsfield web generation pack

Generate these in the Higgsfield **web app** (uses your plan's free/unlimited
generations — the API path doesn't honor them). 1 base + 8 edits = 9 images.

**Save each result with the exact filename shown**, into:
`~/Desktop/BranderUX/atelier-nova/assets/fitting-room-raw/`
(any size ≥1024px portrait; I'll optimize + wire everything after.)

---

## Step 1 — the base figure (generate fresh, Nano Banana Pro or Soul)

**File: `fit-pants-cami--none.png`**

> Full-body editorial fashion photograph, head to toe including shoes. A young
> woman in her late 20s with long straight dark-brown center-parted hair and
> small gold hoop earrings, standing straight facing the camera, arms relaxed
> at her sides, neutral calm expression, flat tan sandals. She wears cream
> high-waisted wide-leg linen pants and an ivory silk camisole with thin
> straps. Warm beige textured plaster wall background, soft diffused window
> light from the left, warm cream palette, minimalist luxury aesthetic,
> high-end catalog photography, portrait orientation 3:4.

## Step 2 — eight edits (Nano Banana Pro, EDIT mode, base image as reference)

Use the SAME instruction frame every time — only the outfit line changes:

> Same woman, same pose, same background, same lighting, same framing (full
> body head to toe). Change ONLY the clothing: {OUTFIT}. Keep her face, hair,
> earrings and sandals identical.

| File | {OUTFIT} |
| --- | --- |
| `fit-pants-cami--terracotta-jacket.png` | add a tailored terracotta rust linen blazer, worn open over the camisole |
| `fit-pants-cami--knit-cardigan.png` | add an oatmeal chunky knit cardigan, worn open over the camisole |
| `fit-wrap-dress--none.png` | she now wears a sand-beige linen midi wrap dress with waist tie, three-quarter sleeves |
| `fit-wrap-dress--terracotta-jacket.png` | sand-beige linen midi wrap dress, with a tailored terracotta rust linen blazer worn open over it |
| `fit-wrap-dress--knit-cardigan.png` | sand-beige linen midi wrap dress, with an oatmeal chunky knit cardigan worn open over it |
| `fit-slip-dress--none.png` | she now wears a champagne silk slip dress with thin straps and cowl neckline, midi length |
| `fit-slip-dress--terracotta-jacket.png` | champagne silk slip dress, with a tailored terracotta rust linen blazer worn open over it |
| `fit-slip-dress--knit-cardigan.png` | champagne silk slip dress, with an oatmeal chunky knit cardigan worn open over it |

## Naming key (don't rename)

`fit-{base}--{layer}.png` — base ∈ `pants-cami | wrap-dress | slip-dress`,
layer ∈ `none | terracotta-jacket | knit-cardigan`. The element's combination
map is keyed off these names.

## Optional Step 3 — the 3D test (1 image is enough)

In the web app's 3D tool (or tell me and I'll run `generate_3d` via API, ~1–2
credits): turn `fit-pants-cami--terracotta-jacket.png` into a 3D model, save as
`fit-3d-test.glb`. We judge the mesh quality together before deciding on the
three.js sandbox addition.
