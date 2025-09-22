#!/bin/bash

# Script de rollback pour CSE Bonnes Affaires
# Restaure la configuration Nginx originale

set -e

echo "🔄 Rollback du déploiement CSE Bonnes Affaires"
echo "============================================="

# Configuration
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

# 1. Arrêter le service CSE Bonnes Affaires
log_info "Arrêt du service CSE Bonnes Affaires..."
if systemctl is-active --quiet $SERVICE_NAME; then
    sudo systemctl stop $SERVICE_NAME
    sudo systemctl disable $SERVICE_NAME
    log_info "✅ Service arrêté et désactivé"
else
    log_warn "⚠️  Service déjà arrêté"
fi

# 2. Trouver la sauvegarde Nginx la plus récente
log_info "Recherche de la sauvegarde Nginx..."
BACKUP_FILE=$(ls -t $NGINX_CONFIG.backup.* 2>/dev/null | head -n1)

if [ -n "$BACKUP_FILE" ]; then
    log_info "✅ Sauvegarde trouvée: $BACKUP_FILE"
    
    # 3. Restaurer la configuration Nginx
    log_info "Restauration de la configuration Nginx..."
    sudo cp "$BACKUP_FILE" "$NGINX_CONFIG"
    
    # 4. Tester la configuration
    if sudo nginx -t; then
        log_info "✅ Configuration Nginx restaurée et valide"
        
        # 5. Recharger Nginx
        sudo systemctl reload nginx
        log_info "✅ Nginx rechargé"
        
    else
        log_error "❌ Erreur dans la configuration restaurée"
        exit 1
    fi
else
    log_warn "⚠️  Aucune sauvegarde trouvée. Configuration manuelle nécessaire."
    
    # Restaurer la configuration originale manuellement
    log_info "Restauration de la configuration originale..."
    sudo tee "$NGINX_CONFIG" > /dev/null <<EOF
server {
    listen 80;
    server_name _;
    
    # Frontend (fichiers statiques)
    location / {
        root /var/www/mhcerts;
        try_files \$uri \$uri/ /index.html;
    }
    
    # API (proxy vers Node.js)
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
EOF

    # Tester et recharger
    if sudo nginx -t; then
        sudo systemctl reload nginx
        log_info "✅ Configuration originale restaurée"
    else
        log_error "❌ Erreur dans la configuration originale"
        exit 1
    fi
fi

# 6. Supprimer le service systemd
log_info "Suppression du service systemd..."
sudo rm -f /etc/systemd/system/$SERVICE_NAME.service
sudo systemctl daemon-reload
log_info "✅ Service systemd supprimé"

# 7. Vérifier que mhcerts fonctionne toujours
log_info "Vérification de mhcerts..."
if systemctl is-active --quiet mhcerts; then
    log_info "✅ mhcerts fonctionne toujours"
else
    log_warn "⚠️  mhcerts n'est pas actif. Redémarrage..."
    sudo systemctl start mhcerts
fi

# 8. Test final
log_info "Test final..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost/ | grep -q "200\|404"; then
    log_info "✅ mhcerts accessible via Nginx"
else
    log_error "❌ mhcerts non accessible via Nginx"
fi

log_info "🎉 Rollback terminé !"
echo ""
echo "📋 État actuel:"
echo "   - mhcerts: http://$(hostname -I | awk '{print $1}')/"
echo "   - CSE Bonnes Affaires: SUPPRIMÉ"
echo ""
echo "🔧 Pour redéployer CSE Bonnes Affaires:"
echo "   ./deploy-mhcerts-integration.sh"
