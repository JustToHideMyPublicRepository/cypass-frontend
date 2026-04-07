#!/bin/bash
# ============================================================
# Script de déploiement CYPASS Frontend sur Cybercub.online
# ============================================================

set -e

echo "=========================================="
echo "  CYPASS Frontend - Déploiement Production"
echo "=========================================="

PROJECT_DIR="/var/www/cybercub/cypass"

# Vérifier si le dossier existe
if [ ! -d "$PROJECT_DIR" ]; then
    echo "❌ Le dossier $PROJECT_DIR n'existe pas."
    exit 1
fi

cd "$PROJECT_DIR"

echo "🧹 Nettoyage des anciens fichiers (si nécessaire)..."
# .output contient déjà tout le nécessaire pour l'exécution

echo "🚀 Redémarrage de l'application Nuxt..."
# Utilisation de PM2 pour gérer le processus Node.js
if pm2 list | grep -q "cypass-front"; then
    echo "   ✅ Redémarrage du processus existant..."
    pm2 restart cypass-front
else
    echo "   📡 Création du nouveau processus PM2..."
    pm2 start .output/server/index.mjs --name "cypass-front"
fi

echo "💾 Sauvegarde de la configuration PM2..."
pm2 save

echo "=========================================="
echo "  ✅ Déploiement frontend terminé !"
echo "=========================================="
