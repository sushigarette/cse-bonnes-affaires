#!/bin/bash

# Déploiement rapide sur Raspberry Pi 4
# Coexistence avec mhcerts

set -e

echo "⚡ Déploiement rapide CSE Bonnes Affaires"
echo "========================================"

# Configuration
APP_NAME="cse-bonnes-affaires"
APP_PORT="3001"
APP_DIR="/home/pi/$APP_NAME"

# 1. Cloner le repository
if [ ! -d "$APP_DIR" ]; then
    echo "📥 Clonage du repository..."
    git clone https://github.com/sushigarette/cse-bonnes-affaires.git "$APP_DIR"
fi

cd "$APP_DIR"

# 2. Installation des dépendances
echo "📦 Installation des dépendances..."
npm install
npm install express

# 3. Build de l'application
echo "🔨 Build de l'application..."
npm run build

# 4. Créer le serveur simple
echo "🖥️  Création du serveur..."
cat > server.js << 'EOF'
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 CSE Bonnes Affaires sur port ${PORT}`);
});
EOF

# 5. Démarrer l'application
echo "🚀 Démarrage de l'application..."
echo "   Accès: http://$(hostname -I | awk '{print $1}'):$APP_PORT"
echo "   Arrêt: Ctrl+C"
echo ""

node server.js
