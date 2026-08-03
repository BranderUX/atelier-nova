// Compile-checks every brander/elements/*.tsx exactly like the Vibe Studio
// pipeline does (sucrase typescript+jsx, automatic runtime) and re-implements
// the static validator's BLOCK rules so seeded code can never 422 on append.
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { transform } from "sucrase";

const DIR = new URL("../brander/elements/", import.meta.url).pathname;

const BLOCK_RULES = [
  [/\beval\s*\(/, "eval()"],
  [/\bnew\s+Function\s*\(/, "new Function()"],
  [/\bdangerouslySetInnerHTML\b/, "dangerouslySetInnerHTML"],
  [/\bfetch\s*\(/, "fetch()"],
  [/\bXMLHttpRequest\b/, "XMLHttpRequest"],
  [/\bWebSocket\b/, "WebSocket"],
  [/\bnavigator\s*\.\s*sendBeacon\b/, "sendBeacon"],
  [/\bdocument\s*\.\s*cookie\b/, "document.cookie"],
  [/\bwindow\s*\.\s*(top|parent|opener)\b/, "window.top/parent/opener"],
  [/\bimport\s*\(/, "dynamic import()"],
  [/<script\b/i, "<script>"],
  [/\b(local|session)Storage\b/, "storage"],
  [/\bpostMessage\s*\(/, "postMessage"],
];

const ALLOWED_IMPORTS = [
  "react",
  "react/jsx-runtime",
  "react-dom",
  "react-dom/client",
  "@mui/material",
  "@mui/system",
  "@emotion/react",
  "@emotion/styled",
  "lucide-react",
  "recharts",
  "framer-motion",
  "date-fns",
];

let failed = false;
for (const file of (await readdir(DIR)).filter((f) => f.endsWith(".tsx"))) {
  const code = await readFile(join(DIR, file), "utf8");
  const problems = [];

  for (const [regex, label] of BLOCK_RULES) {
    if (regex.test(code)) problems.push(`forbidden: ${label}`);
  }
  for (const match of code.matchAll(/^\s*import\b[\s\S]*?from\s*["']([^"']+)["']/gm)) {
    const source = match[1];
    if (!ALLOWED_IMPORTS.some((a) => source === a || source.startsWith(`${a}/`))) {
      problems.push(`disallowed import: ${source}`);
    }
  }
  if (!/export default function Component\(/.test(code)) {
    problems.push("missing `export default function Component(`");
  }
  if (!/export interface Props/.test(code)) {
    problems.push("missing `export interface Props`");
  }
  try {
    transform(code, { transforms: ["typescript", "jsx"], jsxRuntime: "automatic", production: true });
  } catch (error) {
    problems.push(`sucrase: ${error.message}`);
  }

  if (problems.length) {
    failed = true;
    console.error(`✗ ${file}\n  - ${problems.join("\n  - ")}`);
  } else {
    console.warn(`✓ ${file} (${code.split("\n").length} lines)`);
  }
}
// Skeletons: different contract (SkeletonComponent, Box/Skeleton/Stack only) — compile-check only.
const SKELETON_DIR = join(DIR, "skeletons");
for (const file of (await readdir(SKELETON_DIR).catch(() => [])).filter((f) => f.endsWith(".tsx"))) {
  const code = await readFile(join(SKELETON_DIR, file), "utf8");
  const problems = [];
  if (!/export default function SkeletonComponent\(/.test(code)) {
    problems.push("missing `export default function SkeletonComponent(`");
  }
  for (const match of code.matchAll(/^\s*import\b[\s\S]*?from\s*["']([^"']+)["']/gm)) {
    if (match[1] !== "@mui/material") problems.push(`skeleton import not allowed: ${match[1]}`);
  }
  try {
    transform(code, { transforms: ["typescript", "jsx"], jsxRuntime: "automatic", production: true });
  } catch (error) {
    problems.push(`sucrase: ${error.message}`);
  }
  if (problems.length) {
    failed = true;
    console.error(`✗ skeletons/${file}\n  - ${problems.join("\n  - ")}`);
  } else {
    console.warn(`✓ skeletons/${file}`);
  }
}
process.exit(failed ? 1 : 0);
