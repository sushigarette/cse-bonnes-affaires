# 🚀 Guide de déploiement CSE Bonnes Affaires sur Raspberry Pi

## 📋 Configuration actuelle détectée

- **mhcerts:** Port 3001, service systemd actif
- **Nginx:** Configuration dans `/etc/nginx/sites-available/mhcerts`
- **Structure:** Fichiers statiques dans `/var/www/mhcerts`

## 🎯 Solution proposée

### **Accès aux applications:**
- **mhcerts:** `http://IP_DU_PI/` (racine)
- **CSE Bonnes Affaires:** `http://IP_DU_PI/cse/` (sous-chemin)

### **Ports utilisés:**
- **mhcerts:** 3001 (interne)
- **CSE Bonnes Affaires:** 3002 (interne)
- **Nginx:** 80 (externe)

## 🚀 Déploiement

### **1. Préparation sur votre machine locale**

```bash
# Dans le répertoire du projet
git add .
git commit -m "Préparation déploiement Raspberry Pi"
git push origin main
```

### **2. Déploiement sur Raspberry Pi**

```bash
# Se connecter au Raspberry Pi
ssh pi@IP_DU_PI

# Télécharger et exécuter le script de déploiement
wget https://raw.githubusercontent.com/sushigarette/cse-bonnes-affaires/main/deploy-mhcerts-integration.sh
chmod +x deploy-mhcerts-integration.sh
./deploy-mhcerts-integration.sh
```

### **3. Vérification du déploiement**

```bash
# Tester le déploiement
wget https://raw.githubusercontent.com/sushigarette/cse-bonnes-affaires/main/test-deployment.sh
chmod +x test-deployment.sh
./test-deployment.sh
```

## 🔧 Gestion des services

### **Commandes utiles**

```bash
# Status des services
sudo systemctl status mhcerts cse-bonnes-affaires nginx

# Logs des services
sudo journalctl -u mhcerts -f
sudo journalctl -u cse-bonnes-affaires -f
sudo journalctl -u nginx -f

# Redémarrer un service
sudo systemctl restart cse-bonnes-affaires
sudo systemctl restart nginx

# Arrêter CSE Bonnes Affaires
sudo systemctl stop cse-bonnes-affaires
sudo systemctl disable cse-bonnes-affaires
```

### **Mise à jour de l'application**

```bash
cd /home/pi/cse-bonnes-affaires
git pull origin main
npm install
npm run build
sudo systemctl restart cse-bonnes-affaires
```

## 🔄 Rollback (si nécessaire)

```bash
# Restaurer la configuration originale
wget https://raw.githubusercontent.com/sushigarette/cse-bonnes-affaires/main/rollback-deployment.sh
chmod +x rollback-deployment.sh
./rollback-deployment.sh
```

## 📁 Structure des fichiers

```
/home/pi/
├── mhcerts/                    # Votre application existante
└── cse-bonnes-affaires/        # Nouvelle application
    ├── dist/                   # Fichiers buildés
    ├── server.js               # Serveur Express
    └── package.json

/var/www/
└── mhcerts/                    # Fichiers statiques mhcerts

/etc/nginx/sites-available/
└── mhcerts                     # Configuration Nginx (modifiée)

/etc/systemd/system/
└── cse-bonnes-affaires.service # Service systemd
```

## 🐛 Dépannage

### **Problèmes courants**

1. **Service ne démarre pas**
   ```bash
   sudo journalctl -u cse-bonnes-affaires -f
   ```

2. **Nginx ne fonctionne pas**
   ```bash
   sudo nginx -t
   sudo systemctl status nginx
   ```

3. **Port déjà utilisé**
   ```bash
   sudo netstat -tlnp | grep :3002
   ```

4. **Permissions**
   ```bash
   sudo chown -R pi:pi /home/pi/cse-bonnes-affaires
   ```

### **Logs de diagnostic**

```bash
# Vérifier tous les services
sudo systemctl status mhcerts cse-bonnes-affaires nginx

# Vérifier les ports
sudo netstat -tlnp | grep -E ':(80|3001|3002)'

# Tester la connectivité
curl http://localhost:3001/  # mhcerts
curl http://localhost:3002/health  # CSE Bonnes Affaires
curl http://localhost/  # Nginx
curl http://localhost/cse/  # CSE via Nginx
```

## 🎉 Félicitations !

Votre application **CSE Bonnes Affaires** est maintenant déployée et coexiste parfaitement avec **mhcerts** sur votre Raspberry Pi !

### **Accès:**
- **mhcerts:** `http://IP_DU_PI/`
- **CSE Bonnes Affaires:** `http://IP_DU_PI/cse/`
- **Santé CSE:** `http://IP_DU_PI/cse-health`
