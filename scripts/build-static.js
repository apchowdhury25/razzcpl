const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const out = path.join(root, "dist");

const skipDirs = new Set(["node_modules", "dist", ".git", ".gstack", "scripts"]);
const skipFiles = new Set([
  "package.json",
  "package-lock.json",
  "README.md",
  ".gitignore"
]);

function copyTree(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (skipDirs.has(entry.name)) continue;
      copyTree(path.join(src, entry.name), path.join(dest, entry.name));
      continue;
    }
    if (!entry.isFile() || skipFiles.has(entry.name)) continue;
    fs.copyFileSync(path.join(src, entry.name), path.join(dest, entry.name));
  }
}

fs.rmSync(out, { recursive: true, force: true });
copyTree(root, out);

const required = ["index.html", "contact.php", "css/styles.css", "js/site.js", "images/hero.jpg", ".htaccess"];
const missing = required.filter((rel) => !fs.existsSync(path.join(out, rel)));
if (missing.length) {
  console.error("Build incomplete. Missing: " + missing.join(", "));
  process.exit(1);
}

console.log("Output directory: dist");
console.log("Static site copied to dist/");
