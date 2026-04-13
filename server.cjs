/**
 * Serveur de prod (CommonJS) : avec "type": "module" dans package.json,
 * ce fichier doit porter l'extension .cjs pour que require() fonctionne.
 *
 * Préfixe des routes : APP_BASE_PATH (défaut /mhcse). Ex. systemd : Environment=APP_BASE_PATH=/cse
 */
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3002;
const base = (process.env.APP_BASE_PATH || "/mhcse").replace(/\/$/, "");

app.use(base, express.static(path.join(__dirname, "dist")));

app.get(`${base}/*`, (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "mhcse",
    port: PORT,
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`mhcse écoute sur le port ${PORT} (fichiers sous /mhcse/)`);
});
