import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const targetDir = path.join(rootDir, "public", "presentations");

fs.mkdirSync(targetDir, { recursive: true });

const rootEntries = fs.readdirSync(rootDir, { withFileTypes: true });
let copied = 0;

for (const entry of rootEntries) {
  if (!entry.isFile()) continue;
  if (!entry.name.toLowerCase().endsWith(".html")) continue;

  const src = path.join(rootDir, entry.name);
  const dest = path.join(targetDir, entry.name);

  let shouldCopy = true;
  if (fs.existsSync(dest)) {
    const srcStat = fs.statSync(src);
    const destStat = fs.statSync(dest);
    if (srcStat.mtimeMs <= destStat.mtimeMs && srcStat.size === destStat.size) {
      shouldCopy = false;
    }
  }

  if (shouldCopy) {
    fs.copyFileSync(src, dest);
    copied++;
  }
}

if (copied > 0) {
  console.log(`[sync-presentations] Synced ${copied} HTML file(s) to public/presentations/`);
}
