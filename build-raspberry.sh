#!/bin/bash

# Script de build pour Raspberry Pi
echo "🚀 Building for Raspberry Pi deployment..."

# Copier les fichiers de configuration spécifiques
cp vite.config.raspberry.ts vite.config.ts
cp src/App.raspberry.tsx src/App.tsx

# Build l'application (--base /mhcse/ évite d'embarquer http://192.168.x.x dans les assets)
npm run build:raspberry

echo "✅ Build completed for Raspberry Pi!"
echo "📁 Files are ready in ./dist/"
echo ""
echo "To deploy on Raspberry Pi:"
echo "1. Copy dist/* to /var/www/mhcse/dist/"
echo "2. Restart the service: sudo systemctl restart mhcse.service"
