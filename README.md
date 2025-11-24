# Kiosk Touch Protection - Extension Chromium

Extension Chrome Manifest V3 pour kiosque tactile qui désactive la sélection de texte par appui long tout en préservant la saisie dans les champs de formulaire.

## 🎯 Fonctionnalités

✅ **Désactive la sélection de texte** sur toutes les pages web (`user-select: none`)
✅ **Désactive le menu contextuel** (clic droit / appui long)
✅ **Désactive le tap highlight** sur mobile
✅ **Désactive le drag** des éléments (images, liens, etc.)
✅ **Masque automatiquement la scrollbar** si le contenu dépasse de moins de 10 pixels
✅ **Préserve la saisie** dans les champs `input`, `textarea` et `contenteditable`

## 📁 Structure du projet

```
.
├── manifest.json    # Manifest V3 de l'extension
├── content.css      # Styles CSS injectés sur toutes les pages
├── content.js       # Script JavaScript pour bloquer les événements
├── start-kiosk.sh   # Script de démarrage en mode kiosk (prêt à l'emploi)
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

### Méthode 3 : Script de démarrage automatique (Recommandé)

Utilisez le script `start-kiosk.sh` inclus :

```bash
# Définissez l'URL de votre kiosk
export KIOSK_URL="https://votre-site.com"

# Lancez le script
./start-kiosk.sh
```

Le script détecte automatiquement le navigateur disponible (`chromium-browser`, `chromium` ou `google-chrome`) et charge l'extension avec toutes les options optimales pour un kiosk tactile.

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
   - ✅ La scrollbar se masque automatiquement sur les pages avec <10px de surplus → Masquée
   - ✅ La scrollbar reste visible sur les pages avec vrai contenu → Visible
   - ✅ Essayez de taper dans un champ input → Fonctionne
   - ✅ Essayez de sélectionner du texte dans un textarea → Fonctionne

## 📝 Détails techniques

### content.css

Applique les styles suivants :
- `user-select: none` sur tous les éléments
- `-webkit-tap-highlight-color: transparent` pour désactiver le highlight
- `user-drag: none` pour bloquer le drag
- `scrollbar-width: none` et `::-webkit-scrollbar` masqués par défaut
- Classes dynamiques `.kiosk-hide-scrollbar` / `.kiosk-show-scrollbar` pour gérer l'affichage
- **Exception** : `user-select: text` sur `input`, `textarea` et `[contenteditable]`

### content.js

**Blocage d'événements** :
- `selectstart` : Empêche le début de sélection
- `contextmenu` : Bloque le menu contextuel
- `dragstart`, `drag`, `dragend` : Bloque le drag & drop
- `copy`, `cut` : Bloque le copier-coller (sauf dans les inputs)
- Gère les événements tactiles (`touchstart`, `touchend`) pour les appuis longs

**Gestion intelligente de scrollbar** :
- Fonction `manageScrollbarVisibility()` qui détecte automatiquement le dépassement de contenu
- Calcule l'overflow vertical et horizontal (scrollHeight vs clientHeight)
- Masque la scrollbar si le dépassement ≤ 10 pixels
- Surveille les changements : `resize`, `scroll`, `ResizeObserver`, et vérifications périodiques
- Résout le problème des 1-2 pixels parasites qui affichaient inutilement la scrollbar

**Utilitaires** :
- Fonction `isInputElement()` détecte les champs de saisie pour les autoriser

### Personnalisation du seuil de scrollbar

Pour modifier le seuil de masquage de la scrollbar, éditez `content.js` ligne 174 :

```javascript
const SCROLL_THRESHOLD = 10; // Changez cette valeur (en pixels)
```

Exemples :
- `5` : Plus strict, masque seulement si ≤ 5px de dépassement
- `20` : Plus permissif, masque jusqu'à 20px de dépassement
- `0` : Ultra strict, masque uniquement si aucun dépassement

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

### La scrollbar ne se masque pas automatiquement

Si la scrollbar reste visible malgré un faible dépassement :
1. Ouvrez la console DevTools et vérifiez qu'il n'y a pas d'erreurs JavaScript
2. Vérifiez que les classes `kiosk-hide-scrollbar` ou `kiosk-show-scrollbar` sont appliquées sur `<html>`
3. Ajustez le seuil `SCROLL_THRESHOLD` dans `content.js` ligne 174 si nécessaire
4. Certains sites avec styles CSS très complexes peuvent nécessiter `!important` supplémentaires

### La scrollbar se masque mais je ne peux plus scroller

La scrollbar est masquée visuellement mais le scroll reste fonctionnel (souris, tactile, clavier). Si le scroll ne fonctionne vraiment pas, vérifiez que la classe `kiosk-hide-scrollbar` n'applique pas `overflow: hidden` de manière incorrecte.

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
