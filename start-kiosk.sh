#!/bin/bash

# ============================================
# Script de démarrage Chromium Kiosk Mode
# avec extension Touch Protection
# ============================================

# Configuration
EXTENSION_PATH="$(cd "$(dirname "$0")" && pwd)"
KIOSK_URL="${KIOSK_URL:-https://www.example.com}"

# Couleurs pour les messages
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Chromium Kiosk Mode${NC}"
echo -e "${BLUE}  Touch Protection Extension${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${GREEN}Extension path:${NC} $EXTENSION_PATH"
echo -e "${GREEN}URL:${NC} $KIOSK_URL"
echo ""
echo -e "${YELLOW}Démarrage de Chromium...${NC}"
echo ""

# Détecte le navigateur disponible
if command -v chromium-browser &> /dev/null; then
    BROWSER="chromium-browser"
elif command -v chromium &> /dev/null; then
    BROWSER="chromium"
elif command -v google-chrome &> /dev/null; then
    BROWSER="google-chrome"
else
    echo -e "${YELLOW}Erreur: Aucun navigateur Chromium trouvé${NC}"
    echo "Installez chromium-browser, chromium ou google-chrome"
    exit 1
fi

# Lance Chromium en mode kiosk avec l'extension
$BROWSER \
  --kiosk \
  --no-first-run \
  --disable-infobars \
  --disable-session-crashed-bubble \
  --disable-features=TranslateUI \
  --disable-restore-session-state \
  --disable-component-update \
  --noerrdialogs \
  --start-fullscreen \
  --disable-pinch \
  --overscroll-history-navigation=0 \
  --disable-features=TouchpadOverscrollHistoryNavigation \
  --touch-events=enabled \
  --load-extension="$EXTENSION_PATH" \
  --app="$KIOSK_URL"

# Code de sortie
EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
    echo ""
    echo -e "${YELLOW}Chromium s'est terminé avec le code: $EXIT_CODE${NC}"
fi

exit $EXIT_CODE
