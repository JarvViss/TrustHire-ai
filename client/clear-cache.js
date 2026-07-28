const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, ".next");

function rmRecursive(p) {
  if (!fs.existsSync(p)) return;
  if (fs.statSync(p).isDirectory()) {
    for (const entry of fs.readdirSync(p)) {
      rmRecursive(path.join(p, entry));
    }
    try { fs.rmdirSync(p); } catch {}
  } else {
    try { fs.unlinkSync(p); } catch {}
  }
}

rmRecursive(dir);
console.log(".next cache cleared");
// delete self
try { fs.unlinkSync(__filename); } catch {}
