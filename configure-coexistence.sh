#!/bin/bash

# Script de configuration pour la coexistence avec mhcerts
# CSE Bonnes Affaires + mhcerts sur Raspberry Pi 4

set -e

echo "🔧 Configuration de la coexistence CSE Bonnes Affaires + mhcerts"
echo "=============================================================="

# Configuration
CSE_APP="cse-bonnes-affaires"
CSE_PORT="3001"
MHCERTS_PORT="3000"  # Port par défaut de mhcerts
NGINX_CONFIG="/etc/nginx/sites-available/combined"

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# 1. Vérifier les services existants
log_info "Vérification des services existants..."
if systemctl is-active --quiet mhcerts; then
    log_info "✅ mhcerts est actif sur le port $MHCERTS_PORT"
else
    log_warn "⚠️  mhcerts n'est pas actif"
fi

if systemctl is-active --quiet $CSE_APP; then
    log_info "✅ $CSE_APP est actif sur le port $CSE_PORT"
else
    log_warn "⚠️  $CSE_APP n'est pas actif"
fi

# 2. Configuration Nginx pour les deux applications
log_info "Configuration de Nginx pour les deux applications..."
sudo tee "$NGINX_CONFIG" > /dev/null <<EOF
# Configuration pour mhcerts et CSE Bonnes Affaires
server {
    listen 80;
    server_name _;

    # Route pour mhcerts (racine)
    location / {
        proxy_pass http://localhost:$MHCERTS_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Route pour CSE Bonnes Affaires
    location /cse/ {
        proxy_pass http://localhost:$CSE_PORT/;
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

# 3. Activer la nouvelle configuration
log_info "Activation de la configuration Nginx..."
sudo ln -sf "$NGINX_CONFIG" /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

# 4. Configuration du base path pour CSE Bonnes Affaires
log_info "Configuration du base path pour CSE Bonnes Affaires..."
cd /home/pi/$CSE_APP

# Modifier vite.config.ts pour le base path
if [ -f "vite.config.ts" ]; then
    # Sauvegarder la configuration originale
    cp vite.config.ts vite.config.ts.backup
    
    # Modifier la configuration
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

    log_info "✅ Configuration Vite mise à jour avec base path /cse/"
fi

# 5. Rebuild de l'application avec le nouveau base path
log_info "Rebuild de l'application avec le nouveau base path..."
npm run build

# 6. Redémarrer les services
log_info "Redémarrage des services..."
sudo systemctl restart $CSE_APP
sudo systemctl restart nginx

# 7. Vérification
log_info "Vérification des services..."
sleep 3

echo ""
echo "🎉 Configuration terminée!"
echo ""
echo "📋 Accès aux applications:"
echo "   - mhcerts: http://$(hostname -I | awk '{print $1}')/"
echo "   - CSE Bonnes Affaires: http://$(hostname -I | awk '{print $1}')/cse/"
echo ""
echo "🔧 Commandes utiles:"
echo "   - Status mhcerts: sudo systemctl status mhcerts"
echo "   - Status CSE: sudo systemctl status $CSE_APP"
echo "   - Logs Nginx: sudo journalctl -u nginx -f"
echo "   - Test config: sudo nginx -t"
echo ""
echo "📁 Fichiers de configuration:"
echo "   - Nginx: $NGINX_CONFIG"
echo "   - CSE App: /home/pi/$CSE_APP"
echo "   - Backup Vite: /home/pi/$CSE_APP/vite.config.ts.backup"
