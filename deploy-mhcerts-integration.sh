#!/bin/bash

# Script de déploiement CSE Bonnes Affaires
# Intégration avec mhcerts existant sur Raspberry Pi

set -e

echo "🚀 Déploiement CSE Bonnes Affaires avec intégration mhcerts"
echo "========================================================"

# Configuration
APP_NAME="cse-bonnes-affaires"
APP_PORT="3002"  # Port différent de mhcerts (3001)
APP_DIR="/home/pi/$APP_NAME"
SERVICE_NAME="cse-bonnes-affaires"
NGINX_CONFIG="/etc/nginx/sites-available/mhcerts"

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
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

# 1. Vérifier que mhcerts fonctionne
log_info "Vérification de mhcerts..."
if systemctl is-active --quiet mhcerts; then
    log_info "✅ mhcerts est actif sur le port 3001"
else
    log_error "❌ mhcerts n'est pas actif. Veuillez le démarrer d'abord."
    exit 1
fi

# 2. Vérifier Nginx
log_info "Vérification de Nginx..."
if systemctl is-active --quiet nginx; then
    log_info "✅ Nginx est actif"
else
    log_error "❌ Nginx n'est pas actif. Veuillez le démarrer d'abord."
    exit 1
fi

# 3. Cloner ou mettre à jour le repository
if [ -d "$APP_DIR" ]; then
    log_info "Mise à jour du repository existant..."
    cd "$APP_DIR"
    git pull origin main
else
    log_info "Clonage du repository..."
    git clone https://github.com/sushigarette/cse-bonnes-affaires.git "$APP_DIR"
    cd "$APP_DIR"
fi

# 4. Installation des dépendances
log_info "Installation des dépendances..."
npm install

# 5. Configuration Vite pour le sous-chemin
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

# 6. Build de l'application
log_info "Build de l'application..."
npm run build

# 7. Serveur : server.cjs du dépôt + APP_BASE_PATH=/cse

# 8. Configuration du service systemd
log_info "Configuration du service systemd..."
sudo tee /etc/systemd/system/$SERVICE_NAME.service > /dev/null <<EOF
[Unit]
Description=CSE Bonnes Affaires
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=$APP_DIR
ExecStart=/usr/bin/node server.cjs
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=$APP_PORT
Environment=APP_BASE_PATH=/cse

[Install]
WantedBy=multi-user.target
EOF

# 9. Sauvegarder la configuration Nginx actuelle
log_info "Sauvegarde de la configuration Nginx..."
sudo cp "$NGINX_CONFIG" "$NGINX_CONFIG.backup.$(date +%Y%m%d_%H%M%S)"

# 10. Modifier la configuration Nginx pour ajouter CSE Bonnes Affaires
log_info "Modification de la configuration Nginx..."
sudo tee "$NGINX_CONFIG" > /dev/null <<EOF
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

# 11. Tester la configuration Nginx
log_info "Test de la configuration Nginx..."
if sudo nginx -t; then
    log_info "✅ Configuration Nginx valide"
else
    log_error "❌ Erreur dans la configuration Nginx"
    log_info "Restauration de la configuration de sauvegarde..."
    sudo cp "$NGINX_CONFIG.backup.$(date +%Y%m%d_%H%M%S)" "$NGINX_CONFIG"
    exit 1
fi

# 12. Redémarrer les services
log_info "Redémarrage des services..."
sudo systemctl daemon-reload
sudo systemctl enable $SERVICE_NAME
sudo systemctl start $SERVICE_NAME
sudo systemctl reload nginx

# 13. Vérification
log_info "Vérification des services..."
sleep 5

if sudo systemctl is-active --quiet $SERVICE_NAME; then
    log_info "✅ Service CSE Bonnes Affaires démarré"
else
    log_error "❌ Erreur lors du démarrage du service"
    sudo systemctl status $SERVICE_NAME
    exit 1
fi

# 14. Test de connectivité
log_info "Test de connectivité..."
if curl -s http://localhost:$APP_PORT/health > /dev/null; then
    log_info "✅ Service accessible en local"
else
    log_warn "⚠️  Service non accessible en local"
fi

# 15. Afficher les informations de connexion
log_info "🎉 Déploiement terminé!"
echo ""
echo "📋 Informations de connexion:"
echo "   - mhcerts: http://$(hostname -I | awk '{print $1}')/"
echo "   - CSE Bonnes Affaires: http://$(hostname -I | awk '{print $1}')/cse/"
echo "   - Santé CSE: http://$(hostname -I | awk '{print $1}')/cse-health"
echo ""
echo "🔧 Commandes utiles:"
echo "   - Status CSE: sudo systemctl status $SERVICE_NAME"
echo "   - Logs CSE: sudo journalctl -u $SERVICE_NAME -f"
echo "   - Redémarrer CSE: sudo systemctl restart $SERVICE_NAME"
echo "   - Status Nginx: sudo systemctl status nginx"
echo "   - Logs Nginx: sudo journalctl -u nginx -f"
echo ""
echo "📁 Fichiers de configuration:"
echo "   - Service: /etc/systemd/system/$SERVICE_NAME.service"
echo "   - Nginx: $NGINX_CONFIG"
echo "   - App: $APP_DIR"
echo "   - Backup Nginx: $NGINX_CONFIG.backup.*"
