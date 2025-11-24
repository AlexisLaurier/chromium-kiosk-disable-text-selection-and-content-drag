/**
 * Kiosk Touch Protection - Content Script
 * Bloque les événements de sélection, menu contextuel et drag
 */

(function() {
  'use strict';

  /**
   * Vérifie si un élément est un champ de saisie
   */
  function isInputElement(element) {
    if (!element) return false;

    const tagName = element.tagName ? element.tagName.toLowerCase() : '';

    // Vérifie si c'est un input, textarea ou contenteditable
    if (tagName === 'input' || tagName === 'textarea') {
      return true;
    }

    // Vérifie l'attribut contenteditable
    if (element.isContentEditable ||
        element.getAttribute('contenteditable') === 'true' ||
        element.getAttribute('contenteditable') === 'plaintext-only') {
      return true;
    }

    return false;
  }

  /**
   * Gestionnaire d'événement qui bloque sauf pour les champs de saisie
   */
  function preventUnlessInput(event) {
    const target = event.target;

    // Autorise l'événement si c'est un champ de saisie
    if (isInputElement(target)) {
      return true;
    }

    // Bloque l'événement pour tous les autres éléments
    event.preventDefault();
    event.stopPropagation();
    return false;
  }

  /**
   * Gestionnaire qui bloque toujours (pour drag et menu contextuel)
   */
  function preventAlways(event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }

  /**
   * Gestionnaire pour selectstart qui autorise la sélection dans les inputs
   */
  function handleSelectStart(event) {
    return preventUnlessInput(event);
  }

  /**
   * Désactive la sélection par programmation
   */
  function disableProgrammaticSelection() {
    // Intercepte window.getSelection
    const originalGetSelection = window.getSelection;
    window.getSelection = function() {
      const selection = originalGetSelection.call(window);
      const activeElement = document.activeElement;

      // Si l'élément actif n'est pas un champ de saisie, vide la sélection
      if (!isInputElement(activeElement)) {
        if (selection && selection.rangeCount > 0) {
          try {
            selection.removeAllRanges();
          } catch (e) {
            // Ignore les erreurs
          }
        }
      }

      return selection;
    };
  }

  /**
   * Initialise les écouteurs d'événements
   */
  function initEventListeners() {
    const eventOptions = { capture: true, passive: false };

    // Bloque la sélection de texte
    document.addEventListener('selectstart', handleSelectStart, eventOptions);
    document.addEventListener('selectionchange', function(event) {
      const activeElement = document.activeElement;
      if (!isInputElement(activeElement)) {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          try {
            selection.removeAllRanges();
          } catch (e) {
            // Ignore les erreurs
          }
        }
      }
    }, eventOptions);

    // Bloque le menu contextuel (clic droit / appui long)
    document.addEventListener('contextmenu', preventAlways, eventOptions);

    // Bloque tous les événements de drag
    document.addEventListener('dragstart', preventAlways, eventOptions);
    document.addEventListener('drag', preventAlways, eventOptions);
    document.addEventListener('dragend', preventAlways, eventOptions);
    document.addEventListener('dragover', preventAlways, eventOptions);
    document.addEventListener('dragenter', preventAlways, eventOptions);
    document.addEventListener('dragleave', preventAlways, eventOptions);
    document.addEventListener('drop', preventAlways, eventOptions);

    // Bloque le copier-coller (sauf dans les champs de saisie)
    document.addEventListener('copy', preventUnlessInput, eventOptions);
    document.addEventListener('cut', preventUnlessInput, eventOptions);

    // Évite les gestes tactiles de sélection sur mobile
    document.addEventListener('touchstart', function(event) {
      const target = event.target;
      if (!isInputElement(target)) {
        // Empêche l'appui long de déclencher la sélection
        if (event.touches.length === 1) {
          // On n'empêche pas complètement le touchstart pour garder le scroll
          // mais on va surveiller les appuis longs
        }
      }
    }, eventOptions);

    document.addEventListener('touchmove', function(event) {
      // Autorise le scroll même en dehors des inputs
      // Ne rien faire ici permet le scroll normal
    }, { capture: true, passive: true });

    document.addEventListener('touchend', function(event) {
      const target = event.target;
      if (!isInputElement(target)) {
        // Vide toute sélection qui aurait pu se créer
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          try {
            selection.removeAllRanges();
          } catch (e) {
            // Ignore les erreurs
          }
        }
      }
    }, eventOptions);

    // Gère les événements de pointer pour les écrans tactiles modernes
    document.addEventListener('pointerdown', function(event) {
      const target = event.target;
      if (!isInputElement(target) && event.pointerType === 'touch') {
        // Marque le début d'un potentiel appui long
      }
    }, eventOptions);
  }

  /**
   * Surveille les changements du DOM pour les nouveaux éléments
   */
  function observeDOMChanges() {
    const observer = new MutationObserver(function(mutations) {
      // Réapplique les styles si nécessaire
      mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Les styles CSS sont déjà appliqués automatiquement
            // On pourrait ajouter du traitement supplémentaire ici si besoin
          }
        });
      });
    });

    observer.observe(document.documentElement || document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Initialisation au chargement
   */
  function init() {
    // Désactive la sélection par programmation
    disableProgrammaticSelection();

    // Initialise les écouteurs d'événements
    initEventListeners();

    // Surveille les changements du DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', observeDOMChanges);
    } else {
      observeDOMChanges();
    }

    console.log('[Kiosk Touch Protection] Extension activée');
  }

  // Lance l'initialisation
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
