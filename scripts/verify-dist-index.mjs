/**
 * Évite les déploiements avec index.html référencant du HTTP / des IP privées
 * (mixed content derrière https://mhcerts...).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const indexPath = path.join(root, "dist", "index.html");

if (!fs.existsSync(indexPath)) {
  console.error("verify-dist-index: dist/index.html introuvable (lancez le build avant).");
  process.exit(1);
}

const html = fs.readFileSync(indexPath, "utf8");

const problems = [];
if (/192\.168\.\d{1,3}\.\d{1,3}/.test(html)) {
  problems.push("référence à une IP 192.168.x.x");
}
if (/10\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(html)) {
  problems.push("référence à une IP 10.x (privée)");
}
if (/(?:src|href)=["']http:\/\//i.test(html)) {
  problems.push('balise script/link avec URL en http:// (mixed content derrière HTTPS)');
}

if (problems.length) {
  console.error("verify-dist-index: dist/index.html invalide pour une prod HTTPS :");
  for (const p of problems) console.error(`  - ${p}`);
  console.error(
    "\nCorrigez vite.config (base: '/mhcse/' uniquement, pas d’URL http://...) puis : npm run build:raspberry\n",
  );
  process.exit(1);
}

console.log("verify-dist-index: dist/index.html OK (pas de http: ni IP privée détectés).");
