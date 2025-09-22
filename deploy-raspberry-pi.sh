#!/bin/bash

# Script de déploiement CSE Bonnes Affaires sur Raspberry Pi
# Intégration avec mhcerts existant
# Repository: https://github.com/sushigarette/cse-bonnes-affaires

set -e

echo "🚀 Déploiement CSE Bonnes Affaires sur Raspberry Pi"
echo "Repository: https://github.com/sushigarette/cse-bonnes-affaires"
echo "=================================================="

# Configuration
APP_NAME="cse-bonnes-affaires"
APP_PORT="3002"
APP_DIR="/home/pi/$APP_NAME"
SERVICE_NAME="cse-bonnes-affaires"
REPO_URL="https://github.com/sushigarette/cse-bonnes-affaires.git"

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${BLUE}[ÉTAPE]${NC} $1"
}

# 1. Vérifications préliminaires
log_step "1. Vérifications préliminaires"

# Vérifier que mhcerts fonctionne
if systemctl is-active --quiet mhcerts; then
    log_info "✅ mhcerts est actif sur le port 3001"
else
    log_error "❌ mhcerts n'est pas actif. Veuillez le démarrer d'abord."
    echo "   Commande: sudo systemctl start mhcerts"
    exit 1
fi

# Vérifier Nginx
if systemctl is-active --quiet nginx; then
    log_info "✅ Nginx est actif"
else
    log_error "❌ Nginx n'est pas actif. Veuillez le démarrer d'abord."
    echo "   Commande: sudo systemctl start nginx"
    exit 1
fi

# Vérifier Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    log_info "✅ Node.js installé: $NODE_VERSION"
else
    log_error "❌ Node.js n'est pas installé."
    echo "   Installation: sudo apt update && sudo apt install -y nodejs npm"
    exit 1
fi

# 2. Cloner ou mettre à jour le repository
log_step "2. Préparation du code source"

if [ -d "$APP_DIR" ]; then
    log_info "Mise à jour du repository existant..."
    cd "$APP_DIR"
    git pull origin main
else
    log_info "Clonage du repository..."
    git clone "$REPO_URL" "$APP_DIR"
    cd "$APP_DIR"
fi

# 3. Installation des dépendances
log_step "3. Installation des dépendances"

log_info "Installation des dépendances Node.js..."
npm install

log_info "Installation d'Express pour le serveur..."
npm install express

# 4. Configuration Vite pour le sous-chemin
log_step "4. Configuration de l'application"

log_info "Configuration de Vite pour le sous-chemin /cse/..."
cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/cse/',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
EOF

# 5. Build de l'application
log_step "5. Build de l'application"

log_info "Build de l'application..."
npm run build

# 6. Créer le serveur Express
log_step "6. Configuration du serveur"

log_info "Création du serveur Express..."
cat > server.js << 'EOF'
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3002;

// Servir les fichiers statiques
app.use('/cse', express.static(path.join(__dirname, 'dist')));

// Route pour toutes les pages SPA (avec base path /cse/)
app.get('/cse/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Route de santé
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'cse-bonnes-affaires', 
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 CSE Bonnes Affaires démarré sur le port ${PORT}`);
  console.log(`📁 Fichiers statiques servis sur /cse/`);
  console.log(`🏥 Santé: http://localhost:${PORT}/health`);
});
EOF

# 7. Configuration du service systemd
log_step "7. Configuration du service systemd"

log_info "Création du service systemd..."
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

# 8. Sauvegarder et modifier la configuration Nginx
log_step "8. Configuration de Nginx"

log_info "Sauvegarde de la configuration Nginx actuelle..."
sudo cp /etc/nginx/sites-available/mhcerts /etc/nginx/sites-available/mhcerts.backup.$(date +%Y%m%d_%H%M%S)

log_info "Modification de la configuration Nginx..."
sudo tee /etc/nginx/sites-available/mhcerts > /dev/null <<EOF
server {
    listen 80;
    server_name _;
    
    # Frontend mhcerts (fichiers statiques)
    location / {
        root /var/www/mhcerts;
        try_files \$uri \$uri/ /index.html;
    }
    
    # API mhcerts (proxy vers Node.js)
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    # CSE Bonnes Affaires (proxy vers Node.js)
    location /cse/ {
        proxy_pass http://localhost:$APP_PORT/cse/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header X-Forwarded-Prefix /cse;
    }
    
    # Santé CSE Bonnes Affaires
    location /cse-health {
        proxy_pass http://localhost:$APP_PORT/health;
        proxy_set_header Host \$host;
    }
}
EOF

# 9. Tester et recharger Nginx
log_step "9. Test et rechargement de Nginx"

log_info "Test de la configuration Nginx..."
if sudo nginx -t; then
    log_info "✅ Configuration Nginx valide"
    sudo systemctl reload nginx
    log_info "✅ Nginx rechargé"
else
    log_error "❌ Erreur dans la configuration Nginx"
    log_info "Restauration de la configuration de sauvegarde..."
    sudo cp /etc/nginx/sites-available/mhcerts.backup.* /etc/nginx/sites-available/mhcerts
    exit 1
fi

# 10. Démarrer le service CSE Bonnes Affaires
log_step "10. Démarrage du service"

log_info "Démarrage du service CSE Bonnes Affaires..."
sudo systemctl daemon-reload
sudo systemctl enable $SERVICE_NAME
sudo systemctl start $SERVICE_NAME

# 11. Vérification finale
log_step "11. Vérification finale"

sleep 5

if sudo systemctl is-active --quiet $SERVICE_NAME; then
    log_info "✅ Service CSE Bonnes Affaires démarré avec succès"
else
    log_error "❌ Erreur lors du démarrage du service"
    sudo systemctl status $SERVICE_NAME
    exit 1
fi

# 12. Test de connectivité
log_info "Test de connectivité..."
if curl -s http://localhost:$APP_PORT/health | grep -q "ok"; then
    log_info "✅ Service accessible en local"
else
    log_warn "⚠️  Service non accessible en local"
fi

# 13. Affichage des informations finales
log_step "12. Déploiement terminé !"

echo ""
echo "🎉 Déploiement réussi !"
echo ""
echo "📋 Informations de connexion:"
echo "   - mhcerts: http://$(hostname -I | awk '{print $1}')/"
echo "   - CSE Bonnes Affaires: http://$(hostname -I | awk '{print $1}')/cse/"
echo "   - Santé CSE: http://$(hostname -I | awk '{print $1}')/cse-health"
echo ""
echo "🔧 Commandes utiles:"
echo "   - Status: sudo systemctl status $SERVICE_NAME"
echo "   - Logs: sudo journalctl -u $SERVICE_NAME -f"
echo "   - Redémarrer: sudo systemctl restart $SERVICE_NAME"
echo "   - Arrêter: sudo systemctl stop $SERVICE_NAME"
echo ""
echo "📁 Fichiers:"
echo "   - Application: $APP_DIR"
echo "   - Service: /etc/systemd/system/$SERVICE_NAME.service"
echo "   - Nginx: /etc/nginx/sites-available/mhcerts"
echo "   - Backup: /etc/nginx/sites-available/mhcerts.backup.*"
echo ""
echo "🔄 Pour mettre à jour:"
echo "   cd $APP_DIR && git pull origin main && npm run build && sudo systemctl restart $SERVICE_NAME"
