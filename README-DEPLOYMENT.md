# 🚀 Guide de déploiement sur Raspberry Pi 4

Ce guide vous explique comment déployer **CSE Bonnes Affaires** sur votre Raspberry Pi 4 en coexistence avec **mhcerts**.

## 📋 Prérequis

- Raspberry Pi 4 avec Raspbian/Ubuntu
- mhcerts déjà installé et fonctionnel
- Accès SSH ou accès direct au Pi
- Node.js et npm installés

## 🎯 Options de déploiement

### Option 1: Déploiement rapide (Test)

```bash
# Sur votre Raspberry Pi
wget https://raw.githubusercontent.com/lionel/cse-bonnes-affaires/main/quick-deploy.sh
chmod +x quick-deploy.sh
./quick-deploy.sh
```

**Accès:** `http://IP_DU_PI:3001`

### Option 2: Déploiement complet avec Nginx

```bash
# Sur votre Raspberry Pi
wget https://raw.githubusercontent.com/lionel/cse-bonnes-affaires/main/deploy-raspberry.sh
chmod +x deploy-raspberry.sh
./deploy-raspberry.sh
```

### Option 3: Configuration de coexistence

```bash
# Après le déploiement complet
wget https://raw.githubusercontent.com/lionel/cse-bonnes-affaires/main/configure-coexistence.sh
chmod +x configure-coexistence.sh
./configure-coexistence.sh
```

## 🔧 Configuration finale

### Accès aux applications

- **mhcerts:** `http://IP_DU_PI/` (port 80)
- **CSE Bonnes Affaires:** `http://IP_DU_PI/cse/` (via Nginx)

### Ports utilisés

- **mhcerts:** 3000 (interne)
- **CSE Bonnes Affaires:** 3001 (interne)
- **Nginx:** 80 (externe)

## 📁 Structure des fichiers

```
/home/pi/
├── mhcerts/                 # Votre application existante
└── cse-bonnes-affaires/     # Nouvelle application
    ├── dist/               # Fichiers buildés
    ├── server.js           # Serveur Express
    └── package.json
```

## 🛠️ Commandes de gestion

### Services systemd

```bash
# CSE Bonnes Affaires
sudo systemctl status cse-bonnes-affaires
sudo systemctl restart cse-bonnes-affaires
sudo systemctl stop cse-bonnes-affaires

# mhcerts (si configuré en service)
sudo systemctl status mhcerts
sudo systemctl restart mhcerts

# Nginx
sudo systemctl status nginx
sudo systemctl restart nginx
```

### Logs

```bash
# Logs CSE Bonnes Affaires
sudo journalctl -u cse-bonnes-affaires -f

# Logs Nginx
sudo journalctl -u nginx -f

# Logs mhcerts
sudo journalctl -u mhcerts -f
```

## 🔄 Mise à jour

```bash
cd /home/pi/cse-bonnes-affaires
git pull origin main
npm install
npm run build
sudo systemctl restart cse-bonnes-affaires
```

## 🐛 Dépannage

### Problème de port occupé

```bash
# Vérifier les ports utilisés
sudo netstat -tlnp | grep :3001
sudo netstat -tlnp | grep :3000
sudo netstat -tlnp | grep :80
```

### Problème de permissions

```bash
# Corriger les permissions
sudo chown -R pi:pi /home/pi/cse-bonnes-affaires
sudo chmod +x /home/pi/cse-bonnes-affaires/server.js
```

### Problème de Nginx

```bash
# Tester la configuration
sudo nginx -t

# Recharger la configuration
sudo systemctl reload nginx

# Vérifier les logs
sudo tail -f /var/log/nginx/error.log
```

## 📊 Monitoring

### Vérifier l'état des services

```bash
# Script de vérification
#!/bin/bash
echo "=== État des services ==="
echo "mhcerts: $(systemctl is-active mhcerts)"
echo "CSE: $(systemctl is-active cse-bonnes-affaires)"
echo "Nginx: $(systemctl is-active nginx)"
echo ""
echo "=== Ports ouverts ==="
sudo netstat -tlnp | grep -E ':(80|3000|3001)'
```

## 🔒 Sécurité

### Firewall (optionnel)

```bash
# Ouvrir les ports nécessaires
sudo ufw allow 80/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

### HTTPS (optionnel)

Pour activer HTTPS, vous pouvez utiliser Let's Encrypt avec Certbot :

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d votre-domaine.com
```

## 📞 Support

En cas de problème :

1. Vérifiez les logs des services
2. Testez la configuration Nginx
3. Vérifiez que les ports sont libres
4. Consultez la documentation de mhcerts

## 🎉 Félicitations !

Votre application **CSE Bonnes Affaires** est maintenant déployée et coexiste parfaitement avec **mhcerts** sur votre Raspberry Pi 4 !
