#!/bin/bash

# Script de test pour vérifier le déploiement
# CSE Bonnes Affaires + mhcerts

set -e

echo "🧪 Test du déploiement CSE Bonnes Affaires + mhcerts"
echo "================================================="

# Configuration
CSE_PORT="3002"
MHCERTS_PORT="3001"

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

# 1. Test des services systemd
echo "=== Test des services systemd ==="
if systemctl is-active --quiet mhcerts; then
    log_info "✅ mhcerts: ACTIF"
else
    log_error "❌ mhcerts: INACTIF"
fi

if systemctl is-active --quiet cse-bonnes-affaires; then
    log_info "✅ cse-bonnes-affaires: ACTIF"
else
    log_error "❌ cse-bonnes-affaires: INACTIF"
fi

if systemctl is-active --quiet nginx; then
    log_info "✅ nginx: ACTIF"
else
    log_error "❌ nginx: INACTIF"
fi

# 2. Test des ports
echo ""
echo "=== Test des ports ==="
if netstat -tlnp | grep -q ":$MHCERTS_PORT "; then
    log_info "✅ Port $MHCERTS_PORT (mhcerts): OUVERT"
else
    log_error "❌ Port $MHCERTS_PORT (mhcerts): FERMÉ"
fi

if netstat -tlnp | grep -q ":$CSE_PORT "; then
    log_info "✅ Port $CSE_PORT (cse-bonnes-affaires): OUVERT"
else
    log_error "❌ Port $CSE_PORT (cse-bonnes-affaires): FERMÉ"
fi

if netstat -tlnp | grep -q ":80 "; then
    log_info "✅ Port 80 (nginx): OUVERT"
else
    log_error "❌ Port 80 (nginx): FERMÉ"
fi

# 3. Test de connectivité HTTP
echo ""
echo "=== Test de connectivité HTTP ==="

# Test mhcerts
if curl -s -o /dev/null -w "%{http_code}" http://localhost:$MHCERTS_PORT | grep -q "200\|404"; then
    log_info "✅ mhcerts (port $MHCERTS_PORT): RÉPOND"
else
    log_error "❌ mhcerts (port $MHCERTS_PORT): NE RÉPOND PAS"
fi

# Test CSE Bonnes Affaires
if curl -s -o /dev/null -w "%{http_code}" http://localhost:$CSE_PORT/health | grep -q "200"; then
    log_info "✅ cse-bonnes-affaires (port $CSE_PORT): RÉPOND"
else
    log_error "❌ cse-bonnes-affaires (port $CSE_PORT): NE RÉPOND PAS"
fi

# Test Nginx
if curl -s -o /dev/null -w "%{http_code}" http://localhost/ | grep -q "200\|404"; then
    log_info "✅ nginx (port 80): RÉPOND"
else
    log_error "❌ nginx (port 80): NE RÉPOND PAS"
fi

# 4. Test des routes spécifiques
echo ""
echo "=== Test des routes spécifiques ==="

# Test route mhcerts via Nginx
if curl -s -o /dev/null -w "%{http_code}" http://localhost/ | grep -q "200\|404"; then
    log_info "✅ Route mhcerts (/) via Nginx: OK"
else
    log_error "❌ Route mhcerts (/) via Nginx: ERREUR"
fi

# Test route CSE via Nginx
if curl -s -o /dev/null -w "%{http_code}" http://localhost/cse/ | grep -q "200\|404"; then
    log_info "✅ Route CSE (/cse/) via Nginx: OK"
else
    log_error "❌ Route CSE (/cse/) via Nginx: ERREUR"
fi

# Test santé CSE
if curl -s http://localhost/cse-health | grep -q "ok"; then
    log_info "✅ Santé CSE (/cse-health): OK"
else
    log_error "❌ Santé CSE (/cse-health): ERREUR"
fi

# 5. Test de la configuration Nginx
echo ""
echo "=== Test de la configuration Nginx ==="
if sudo nginx -t > /dev/null 2>&1; then
    log_info "✅ Configuration Nginx: VALIDE"
else
    log_error "❌ Configuration Nginx: INVALIDE"
    sudo nginx -t
fi

# 6. Résumé
echo ""
echo "=== RÉSUMÉ ==="
echo ""

# Compter les erreurs
ERRORS=0

if ! systemctl is-active --quiet mhcerts; then
    ((ERRORS++))
fi

if ! systemctl is-active --quiet cse-bonnes-affaires; then
    ((ERRORS++))
fi

if ! systemctl is-active --quiet nginx; then
    ((ERRORS++))
fi

if [ $ERRORS -eq 0 ]; then
    log_info "🎉 Tous les services sont opérationnels !"
    echo ""
    echo "📋 Accès aux applications:"
    echo "   - mhcerts: http://$(hostname -I | awk '{print $1}')/"
    echo "   - CSE Bonnes Affaires: http://$(hostname -I | awk '{print $1}')/cse/"
    echo "   - Santé CSE: http://$(hostname -I | awk '{print $1}')/cse-health"
else
    log_error "❌ $ERRORS service(s) en erreur. Vérifiez les logs."
    echo ""
    echo "🔧 Commandes de diagnostic:"
    echo "   - Logs mhcerts: sudo journalctl -u mhcerts -f"
    echo "   - Logs CSE: sudo journalctl -u cse-bonnes-affaires -f"
    echo "   - Logs Nginx: sudo journalctl -u nginx -f"
    echo "   - Status: sudo systemctl status mhcerts cse-bonnes-affaires nginx"
fi
