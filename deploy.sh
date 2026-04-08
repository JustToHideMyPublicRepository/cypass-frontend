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
# Vérifier les permissions d'écriture
if [ ! -w "$PROJECT_DIR" ]; then
    echo "❌ Erreur : L'utilisateur n'a pas les droits d'écriture sur $PROJECT_DIR"
    echo "💡 Action requise : sudo chown -R $(whoami):$(whoami) $PROJECT_DIR"
    exit 1
fi

cd "$PROJECT_DIR"

if [ ! -d ".output" ]; then
    echo "❌ Erreur : Le dossier .output n'existe pas. Le transfert a probablement échoué."
    exit 1
fi

echo "🚀 Redémarrage de l'application Nuxt avec PM2..."
# Utilisation de PM2 reload pour éviter l'interruption complète si possible
if pm2 list | grep -q "cypass-front"; then
    echo "   ✅ Redémarrage du processus existant..."
    pm2 restart cypass-front
else
    echo "   📡 Création d'un nouveau processus PM2..."
    pm2 start .output/server/index.mjs --name "cypass-front"
fi

echo "💾 Sauvegarde de la configuration PM2..."
pm2 save --force

echo "=========================================="
echo "  ✅ Déploiement frontend terminé !"
echo "=========================================="
