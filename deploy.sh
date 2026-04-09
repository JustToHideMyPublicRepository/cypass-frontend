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

# Charger les profils pour s'assurer que pm2 est dans le PATH
[ -f ~/.bashrc ] && . ~/.bashrc
[ -f ~/.profile ] && . ~/.profile

# Définir la commande PM2 à utiliser
if command -v pm2 >/dev/null 2>&1; then
    PM2_CMD="pm2"
else
    PM2_CMD="npx pm2"
fi

echo "📡 Utilisation de la commande : $PM2_CMD"

# Utilisation de PM2 reload pour éviter l'interruption complète si possible
if $PM2_CMD list | grep -q "cypass-front"; then
    echo "   ✅ Redémarrage du processus existant..."
    $PM2_CMD restart cypass-front
else
    echo "   📡 Création d'un nouveau processus PM2..."
    $PM2_CMD start .output/server/index.mjs --name "cypass-front"
fi

echo "💾 Sauvegarde de la configuration PM2..."
$PM2_CMD save --force

echo "=========================================="
echo "  ✅ Déploiement frontend terminé !"
echo "=========================================="
