#!/bin/bash

# Script de mise à jour pour mhcse sur Raspberry Pi
# Projet dans /var/www/mhcse/
# Usage: ./update-mhcse.sh

set -e

echo "🔄 Mise à jour mhcse sur Raspberry Pi"
echo "====================================="

# Configuration
APP_DIR="/var/www/mhcse"
SERVICE_NAME="mhcse"  # À adapter selon votre service systemd

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

# 1. Vérifier que le répertoire existe
log_step "1. Vérification du répertoire"
if [ ! -d "$APP_DIR" ]; then
    log_error "❌ Le répertoire $APP_DIR n'existe pas."
    exit 1
fi
log_info "✅ Répertoire trouvé: $APP_DIR"

# 2. Aller dans le répertoire
cd "$APP_DIR"

# 3. Sauvegarder l'état actuel
log_step "2. Sauvegarde de l'état actuel"
CURRENT_COMMIT=$(git rev-parse HEAD 2>/dev/null || echo "unknown")
log_info "Commit actuel: $CURRENT_COMMIT"

# 4. Récupérer les dernières modifications
log_step "3. Récupération des modifications"
log_info "Récupération des dernières modifications depuis GitHub..."
if git pull origin main; then
    log_info "✅ Modifications récupérées avec succès"
else
    log_error "❌ Erreur lors de la récupération des modifications"
    exit 1
fi

NEW_COMMIT=$(git rev-parse HEAD 2>/dev/null || echo "unknown")
if [ "$CURRENT_COMMIT" = "$NEW_COMMIT" ] && [ "$CURRENT_COMMIT" != "unknown" ]; then
    log_warn "⚠️  Déjà sur le dernier commit — on régénère dist quand même (corrige un index.html avec mauvaise base URL)."
fi

# 5. Installer les nouvelles dépendances
log_step "4. Installation des dépendances"
log_info "Installation des dépendances Node.js..."
if npm install; then
    log_info "✅ Dépendances installées"
else
    log_error "❌ Erreur lors de l'installation des dépendances"
    exit 1
fi

# 6. Build de l'application
log_step "5. Build de l'application"
log_info "Compilation de l'application..."

# Vérifier si build-raspberry.sh existe
if [ -f "build-raspberry.sh" ]; then
    log_info "Utilisation du script build-raspberry.sh..."
    chmod +x build-raspberry.sh
    ./build-raspberry.sh
else
    log_info "Préparation config Raspberry + build avec base /mhcse/..."
    [ -f "vite.config.raspberry.ts" ] && cp vite.config.raspberry.ts vite.config.ts
    [ -f "src/App.raspberry.tsx" ] && cp src/App.raspberry.tsx src/App.tsx
    if grep -q '"build:raspberry"' package.json; then
        npm run build:raspberry
    else
        log_warn "package.json sans build:raspberry — npm run build (vérifiez base /mhcse/)"
        npm run build
    fi
fi

if [ -d "dist" ] && [ "$(ls -A dist)" ]; then
    log_info "✅ Build réussi"
else
    log_error "❌ Erreur lors du build ou répertoire dist vide"
    exit 1
fi

# 7. Redémarrer le service (si service systemd existe)
log_step "6. Redémarrage du service"

# Vérifier quel service existe
if systemctl list-unit-files | grep -q "mhcse.service"; then
    SERVICE_NAME="mhcse"
elif systemctl list-unit-files | grep -q "cse-bonnes-affaires.service"; then
    SERVICE_NAME="cse-bonnes-affaires"
else
    log_warn "⚠️  Aucun service systemd trouvé (mhcse ou cse-bonnes-affaires)"
    log_info "   Vous devrez redémarrer manuellement le serveur"
    log_step "7. Mise à jour terminée !"
    echo ""
    echo "🎉 Mise à jour réussie !"
    echo ""
    echo "📋 Informations:"
    echo "   - Ancien commit: $CURRENT_COMMIT"
    echo "   - Nouveau commit: $NEW_COMMIT"
    echo ""
    echo "⚠️  N'oubliez pas de redémarrer votre serveur manuellement"
    echo ""
    exit 0
fi

log_info "Redémarrage du service $SERVICE_NAME..."
if sudo systemctl restart $SERVICE_NAME; then
    log_info "✅ Service redémarré"
else
    log_error "❌ Erreur lors du redémarrage du service"
    log_info "Tentative de redémarrage manuel..."
    exit 1
fi

# 8. Vérification
log_step "7. Vérification"
sleep 3

if sudo systemctl is-active --quiet $SERVICE_NAME; then
    log_info "✅ Service actif et fonctionnel"
else
    log_error "❌ Le service n'est pas actif"
    log_info "Vérification des logs..."
    sudo systemctl status $SERVICE_NAME --no-pager -l
    exit 1
fi

# 9. Test de connectivité (optionnel)
log_info "Test de connectivité..."
if command -v curl &> /dev/null; then
    if curl -s http://localhost/health 2>/dev/null | grep -q "ok"; then
        log_info "✅ Service accessible"
    else
        log_warn "⚠️  Service non accessible en local (peut être normal)"
    fi
fi

# 10. Affichage des informations
log_step "8. Mise à jour terminée !"

echo ""
echo "🎉 Mise à jour réussie !"
echo ""
echo "📋 Informations:"
echo "   - Ancien commit: $CURRENT_COMMIT"
echo "   - Nouveau commit: $NEW_COMMIT"
echo "   - Service: $SERVICE_NAME"
echo ""
echo "🔧 Commandes utiles:"
echo "   - Status: sudo systemctl status $SERVICE_NAME"
echo "   - Logs: sudo journalctl -u $SERVICE_NAME -f"
echo "   - Vérifier l'application: http://$(hostname -I | awk '{print $1}')/mhcse/"
echo ""

