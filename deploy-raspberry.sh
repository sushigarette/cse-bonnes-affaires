#!/bin/bash

# Script de déploiement pour Raspberry Pi 4
# Application: CSE Bonnes Affaires
# Coexistence avec mhcerts

set -e

echo "🚀 Déploiement de CSE Bonnes Affaires sur Raspberry Pi 4"
echo "=================================================="

# Configuration
APP_NAME="cse-bonnes-affaires"
APP_PORT="3001"  # Port différent de mhcerts
APP_DIR="/home/pi/$APP_NAME"
SERVICE_NAME="cse-bonnes-affaires"
NGINX_CONFIG="/etc/nginx/sites-available/$APP_NAME"

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier si on est sur le Raspberry Pi
if [[ $(hostname) != "raspberrypi" ]] && [[ ! $(hostname) =~ pi ]]; then
    log_warn "Ce script est conçu pour Raspberry Pi. Continuer quand même ? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 1. Mise à jour du système
log_info "Mise à jour du système..."
sudo apt update && sudo apt upgrade -y

# 2. Installation des dépendances
log_info "Installation des dépendances..."
sudo apt install -y nginx nodejs npm git

# Vérifier la version de Node.js
NODE_VERSION=$(node --version)
log_info "Version de Node.js: $NODE_VERSION"

# 3. Cloner ou mettre à jour le repository
if [ -d "$APP_DIR" ]; then
    log_info "Mise à jour du repository existant..."
    cd "$APP_DIR"
    git pull origin main
else
    log_info "Clonage du repository..."
    git clone https://github.com/lionel/cse-bonnes-affaires.git "$APP_DIR"
    cd "$APP_DIR"
fi

# 4. Installation des dépendances Node.js
log_info "Installation des dépendances Node.js..."
npm install

# 5. Build de l'application
log_info "Build de l'application..."
npm run build

# 6. Configuration du service systemd
log_info "Configuration du service systemd..."
sudo tee /etc/systemd/system/$SERVICE_NAME.service > /dev/null <<EOF
[Unit]
Description=CSE Bonnes Affaires
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=$APP_DIR
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=$APP_PORT

[Install]
WantedBy=multi-user.target
EOF

# 7. Créer le serveur Node.js simple
log_info "Création du serveur Node.js..."
cat > server.js << 'EOF'
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'dist')));

// Route pour toutes les pages (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 CSE Bonnes Affaires démarré sur le port ${PORT}`);
});
EOF

# 8. Installation d'Express
log_info "Installation d'Express pour le serveur..."
npm install express

# 9. Configuration Nginx
log_info "Configuration de Nginx..."
sudo tee "$NGINX_CONFIG" > /dev/null <<EOF
server {
    listen 80;
    server_name cse.local;  # ou votre domaine

    location / {
        proxy_pass http://localhost:$APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# 10. Activer le site Nginx
log_info "Activation du site Nginx..."
sudo ln -sf "$NGINX_CONFIG" /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# 11. Démarrer le service
log_info "Démarrage du service..."
sudo systemctl daemon-reload
sudo systemctl enable $SERVICE_NAME
sudo systemctl start $SERVICE_NAME

# 12. Vérification du statut
log_info "Vérification du statut..."
sleep 5
if sudo systemctl is-active --quiet $SERVICE_NAME; then
    log_info "✅ Service démarré avec succès!"
else
    log_error "❌ Erreur lors du démarrage du service"
    sudo systemctl status $SERVICE_NAME
    exit 1
fi

# 13. Afficher les informations de connexion
log_info "🎉 Déploiement terminé!"
echo ""
echo "📋 Informations de connexion:"
echo "   - Application: http://$(hostname -I | awk '{print $1}'):$APP_PORT"
echo "   - Via Nginx: http://cse.local (si configuré dans /etc/hosts)"
echo "   - Service: sudo systemctl status $SERVICE_NAME"
echo "   - Logs: sudo journalctl -u $SERVICE_NAME -f"
echo ""
echo "🔧 Commandes utiles:"
echo "   - Redémarrer: sudo systemctl restart $SERVICE_NAME"
echo "   - Arrêter: sudo systemctl stop $SERVICE_NAME"
echo "   - Logs: sudo journalctl -u $SERVICE_NAME -f"
echo "   - Nginx: sudo systemctl status nginx"
echo ""
echo "📁 Fichiers de configuration:"
echo "   - Service: /etc/systemd/system/$SERVICE_NAME.service"
echo "   - Nginx: $NGINX_CONFIG"
echo "   - App: $APP_DIR"
