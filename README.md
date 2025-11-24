# Kiosk Touch Protection - Extension Chromium

Extension Chrome Manifest V3 pour kiosque tactile qui désactive la sélection de texte par appui long tout en préservant la saisie dans les champs de formulaire.

## 🎯 Fonctionnalités

✅ **Désactive la sélection de texte** sur toutes les pages web (`user-select: none`)
✅ **Désactive le menu contextuel** (clic droit / appui long)
✅ **Désactive le tap highlight** sur mobile
✅ **Désactive le drag** des éléments (images, liens, etc.)
✅ **Masque complètement la scrollbar** (le scroll reste fonctionnel)
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

**Étape 1 : Accéder au gestionnaire d'extensions**
- Ouvrez Chromium/Chrome
- Accédez au menu extensions via **une des méthodes suivantes** :
  - Tapez `chrome://extensions/` dans la barre d'adresse
  - OU Menu (⋮) → **Extensions** → **Gérer les extensions**
  - OU Menu (⋮) → **Plus d'outils** → **Extensions**

**Étape 2 : Activer le mode développeur**
- En haut à droite de la page, activez le bouton **Mode développeur**

**Étape 3 : Charger l'extension**
- Cliquez sur le bouton **Charger l'extension non empaquetée** (apparaît après activation du mode développeur)
- Sélectionnez le dossier `chromium-kiosk-disable-text-selection-and-content-drag`
- L'extension apparaît dans la liste avec le nom "Kiosk Touch Protection"

✅ L'extension est maintenant active sur tous les onglets !

## 🧪 Test de l'extension

1. Une fois l'extension chargée, visitez n'importe quel site web
2. Testez les fonctionnalités :
   - ❌ Essayez de sélectionner du texte (appui long sur mobile) → Bloqué
   - ❌ Essayez de faire un clic droit → Bloqué
   - ❌ Essayez de glisser une image → Bloqué
   - ✅ La scrollbar est invisible (mais le scroll fonctionne avec molette/tactile)
   - ✅ Essayez de taper dans un champ input → Fonctionne
   - ✅ Essayez de sélectionner du texte dans un textarea → Fonctionne

## 📝 Détails techniques

### content.css

Applique les styles suivants :
- `user-select: none` sur tous les éléments
- `-webkit-tap-highlight-color: transparent` pour désactiver le highlight
- `user-drag: none` pour bloquer le drag
- `scrollbar-width: none` et `::-webkit-scrollbar` masqués en permanence
- **Exception** : `user-select: text` sur `input`, `textarea` et `[contenteditable]`

### content.js

**Blocage d'événements** :
- `selectstart` : Empêche le début de sélection
- `contextmenu` : Bloque le menu contextuel
- `dragstart`, `drag`, `dragend` : Bloque le drag & drop
- `copy`, `cut` : Bloque le copier-coller (sauf dans les inputs)
- Gère les événements tactiles (`touchstart`, `touchend`) pour les appuis longs

**Utilitaires** :
- Fonction `isInputElement()` détecte les champs de saisie pour les autoriser

**Note** : La scrollbar est masquée visuellement par CSS pur, mais le défilement reste entièrement fonctionnel (molette de souris, gestes tactiles, clavier).

## 🐛 Dépannage

### La sélection fonctionne encore sur certains sites

Certains sites utilisent des Shadow DOM ou des iframes. L'option `all_frames: true` dans le manifest devrait gérer les iframes, mais certains cas particuliers peuvent nécessiter des ajustements.

### Les champs input ne sont pas éditables

Vérifiez que le fichier `content.css` est bien chargé et que les styles d'exception sont appliqués. Inspectez l'élément avec DevTools (si activé).

### Le scroll ne fonctionne pas

La scrollbar est masquée visuellement mais le scroll doit rester fonctionnel (molette de souris, gestes tactiles, flèches du clavier). Si le scroll ne fonctionne vraiment pas, il peut y avoir un conflit avec des styles CSS du site. Vérifiez dans DevTools que `overflow: hidden` n'est pas appliqué sur `<html>` ou `<body>`.

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
