# 🚀 Guide de déploiement final - CSE Bonnes Affaires

## 📋 Repository
**GitHub:** [https://github.com/sushigarette/cse-bonnes-affaires](https://github.com/sushigarette/cse-bonnes-affaires)

## 🎯 Configuration finale

### **Accès aux applications:**
- **mhcerts:** `http://IP_DU_PI/` (racine)
- **CSE Bonnes Affaires:** `http://IP_DU_PI/cse/` (sous-chemin)

### **Ports utilisés:**
- **mhcerts:** 3001 (interne)
- **CSE Bonnes Affaires:** 3002 (interne)
- **Nginx:** 80 (externe)

## 🚀 Déploiement en 3 étapes

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
wget https://raw.githubusercontent.com/sushigarette/cse-bonnes-affaires/main/deploy-raspberry-pi.sh
chmod +x deploy-raspberry-pi.sh
./deploy-raspberry-pi.sh
```

### **3. Vérification**

```bash
# Tester l'accès
curl http://localhost/cse-health

# Vérifier les services
sudo systemctl status mhcerts cse-bonnes-affaires nginx
```

## 🔧 Gestion des services

### **Commandes essentielles**

```bash
# Status des services
sudo systemctl status mhcerts cse-bonnes-affaires nginx

# Logs en temps réel
sudo journalctl -u cse-bonnes-affaires -f

# Redémarrer CSE Bonnes Affaires
sudo systemctl restart cse-bonnes-affaires

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

### **Test de connectivité**

```bash
# Test local
curl http://localhost:3002/health

# Test via Nginx
curl http://localhost/cse-health

# Test complet
curl http://localhost/          # mhcerts
curl http://localhost/cse/      # CSE Bonnes Affaires
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

## 🎉 Félicitations !

Votre application **CSE Bonnes Affaires** est maintenant déployée et coexiste parfaitement avec **mhcerts** sur votre Raspberry Pi !

### **Accès:**
- **mhcerts:** `http://IP_DU_PI/`
- **CSE Bonnes Affaires:** `http://IP_DU_PI/cse/`
- **Santé CSE:** `http://IP_DU_PI/cse-health`

### **Repository:**
[https://github.com/sushigarette/cse-bonnes-affaires](https://github.com/sushigarette/cse-bonnes-affaires)
