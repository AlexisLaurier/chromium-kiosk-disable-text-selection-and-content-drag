# Kiosk Touch Protection - Extension Chromium

Extension Chrome Manifest V3 pour kiosque tactile qui désactive la sélection de texte par appui long tout en préservant la saisie dans les champs de formulaire.

## 🎯 Fonctionnalités

✅ **Désactive la sélection de texte** sur toutes les pages web (`user-select: none`)
✅ **Désactive le menu contextuel** (clic droit / appui long)
✅ **Désactive le tap highlight** sur mobile
✅ **Désactive le drag** des éléments (images, liens, etc.)
✅ **Préserve la saisie** dans les champs `input`, `textarea` et `contenteditable`

## 📁 Structure du projet

```
.
├── manifest.json    # Manifest V3 de l'extension
├── content.css      # Styles CSS injectés sur toutes les pages
├── content.js       # Script JavaScript pour bloquer les événements
└── README.md        # Ce fichier
```

## 🚀 Installation

### Méthode 1 : Chargement en mode développeur

1. Ouvrez Chromium/Chrome
2. Allez dans `chrome://extensions/`
3. Activez le **Mode développeur** (en haut à droite)
4. Cliquez sur **Charger l'extension non empaquetée**
5. Sélectionnez le dossier contenant les fichiers de l'extension

### Méthode 2 : Ligne de commande (Mode Kiosk)

Pour lancer Chromium directement en mode kiosk avec l'extension chargée :

```bash
chromium-browser \
  --kiosk \
  --no-first-run \
  --disable-infobars \
  --disable-session-crashed-bubble \
  --disable-features=TranslateUI \
  --load-extension=/chemin/vers/chromium-kiosk-disable-text-selection-and-content-drag \
  --app=https://votre-site.com
```

### Méthode 3 : Script de démarrage automatique

Créez un script `start-kiosk.sh` :

```bash
#!/bin/bash

# Configuration
EXTENSION_PATH="/home/user/chromium-kiosk-disable-text-selection-and-content-drag"
KIOSK_URL="https://votre-site.com"

# Lancement de Chromium en mode kiosk
chromium-browser \
  --kiosk \
  --no-first-run \
  --disable-infobars \
  --disable-session-crashed-bubble \
  --disable-features=TranslateUI \
  --disable-restore-session-state \
  --disable-component-update \
  --noerrdialogs \
  --load-extension="$EXTENSION_PATH" \
  --app="$KIOSK_URL"
```

Rendez-le exécutable :

```bash
chmod +x start-kiosk.sh
./start-kiosk.sh
```

## 🔧 Options de ligne de commande supplémentaires

Pour un kiosk robuste, ajoutez ces options :

```bash
--start-fullscreen              # Démarre en plein écran
--disable-pinch                 # Désactive le zoom par pincement
--overscroll-history-navigation=0  # Désactive la navigation par glissement
--disable-features=TouchpadOverscrollHistoryNavigation  # Désactive navigation tactile
--touch-events=enabled          # Active les événements tactiles
--disable-dev-tools             # Désactive les outils de développement
--disable-translate             # Désactive la traduction automatique
--disable-save-password-bubble  # Désactive l'enregistrement des mots de passe
```

## 🧪 Test de l'extension

1. Une fois l'extension chargée, visitez n'importe quel site web
2. Testez les fonctionnalités :
   - ❌ Essayez de sélectionner du texte (appui long sur mobile) → Bloqué
   - ❌ Essayez de faire un clic droit → Bloqué
   - ❌ Essayez de glisser une image → Bloqué
   - ✅ Essayez de taper dans un champ input → Fonctionne
   - ✅ Essayez de sélectionner du texte dans un textarea → Fonctionne

## 📝 Détails techniques

### content.css

Applique les styles suivants :
- `user-select: none` sur tous les éléments
- `-webkit-tap-highlight-color: transparent` pour désactiver le highlight
- `user-drag: none` pour bloquer le drag
- **Exception** : `user-select: text` sur `input`, `textarea` et `[contenteditable]`

### content.js

Bloque les événements JavaScript suivants :
- `selectstart` : Empêche le début de sélection
- `contextmenu` : Bloque le menu contextuel
- `dragstart`, `drag`, `dragend` : Bloque le drag & drop
- `copy`, `cut` : Bloque le copier-coller (sauf dans les inputs)
- Gère les événements tactiles (`touchstart`, `touchend`) pour les appuis longs

La fonction `isInputElement()` détecte les champs de saisie pour les autoriser.

## 🐛 Dépannage

### L'extension ne se charge pas en mode kiosk

Vérifiez que le chemin absolu de l'extension est correct :

```bash
# Utilisez le chemin absolu complet
--load-extension=/home/user/chromium-kiosk-disable-text-selection-and-content-drag
```

### La sélection fonctionne encore sur certains sites

Certains sites utilisent des Shadow DOM ou des iframes. L'option `all_frames: true` dans le manifest devrait gérer les iframes, mais certains cas particuliers peuvent nécessiter des ajustements.

### Les champs input ne sont pas éditables

Vérifiez que le fichier `content.css` est bien chargé et que les styles d'exception sont appliqués. Inspectez l'élément avec DevTools (si activé).

## 🔒 Sécurité et permissions

Cette extension utilise un minimum de permissions :
- ✅ Aucune permission spéciale requise
- ✅ Fonctionne sur `<all_urls>` (nécessaire pour un kiosk)
- ✅ Injection au démarrage (`document_start`) pour une protection maximale
- ✅ Pas d'accès réseau, pas de stockage, pas de données sensibles

## 📄 Licence

Ce projet est fourni tel quel, sans garantie. Utilisez-le librement pour vos besoins de kiosk.

## 🤝 Contribution

Les améliorations sont les bienvenues ! N'hésitez pas à proposer des modifications pour gérer des cas particuliers.

---

**Note** : Cette extension est conçue spécifiquement pour des environnements de kiosk contrôlés. Elle ne doit pas être utilisée sur un navigateur personnel car elle modifie significativement le comportement par défaut du navigateur.
