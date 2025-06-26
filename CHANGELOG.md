# 📋 Changelog - Budget Familial

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

## [1.0.1] - 2025-06-26

### 🆕 Ajouté
- **🎤 Reconnaissance Vocale Intelligente**
  - Saisie vocale des dépenses avec formats flexibles
  - Reconnaissance automatique des catégories (épicerie, restaurant, etc.)
  - Support des formats : "Épicerie 25 euros courses" ou "25 euros épicerie"
  - Popup d'aide avec instructions détaillées
  - Traitement 100% local pour la confidentialité
  - Compatible Chrome, Edge, Safari

- **📱 Interface Mobile Optimisée**
  - Navigation en bas d'écran sur mobile
  - Header compact avec logo et texte adaptatifs
  - Cartes responsives (grid 2 colonnes sur mobile)
  - Icônes et textes redimensionnés pour mobile
  - Padding et marges optimisés

- **🎯 Améliorations UX**
  - Logo cliquable intelligent (ferme paramètres + va au dashboard)
  - Navigation cohérente (tous les boutons ferment les paramètres)
  - Sticky header pour une meilleure navigation
  - Bouton d'aide (HelpCircle) pour les commandes vocales

### 🔧 Corrigé
- **Assets en Production**
  - Chemin du logo corrigé pour le build de production
  - Ressources correctement référencées dans dist/

### 🎨 Amélioré
- **Interface Vocale**
  - Instructions déplacées dans un popup élégant
  - Interface plus propre sans encombrement
  - Feedback visuel amélioré (statuts colorés)
  - Boutons d'aide et de microphone séparés

- **Navigation Mobile**
  - Bottom navigation avec icônes et labels courts
  - Transitions fluides entre les onglets
  - États visuels clairs pour l'onglet actif
  - Masquage automatique en mode paramètres

### 📊 Performance
- **Bundle Size**: 238KB JS (70KB gzippé), 19KB CSS (4KB gzippé)
- **Optimisations**: Composants React mémorisés
- **Chargement**: Optimisé avec Vite

### 🎤 Détails Reconnaissance Vocale

#### Catégories Reconnues
| Mots-clés | Catégorie |
|-----------|-----------|
| épicerie, courses, nourriture | Épicerie |
| restaurant, resto, repas | Restaurant |
| essence, carburant | Essence |
| facture, électricité, eau | Factures |
| shopping, vêtements | Shopping |
| santé, médecin, pharmacie | Santé |

#### Exemples de Commandes
```
✅ "Épicerie 25 euros courses hebdomadaires"
✅ "Restaurant 15 euros déjeuner"
✅ "50 euros essence carburant"
✅ "Factures 80 euros électricité"
```

### 📱 Détails Interface Mobile

#### Navigation
- **Position**: Bottom navigation fixe
- **Icônes**: Adaptatives (4x4 mobile, 5x5 desktop)
- **Labels**: Courts ("Accueil" vs "Tableau de bord")
- **États**: Couleurs distinctes pour l'onglet actif

#### Layout
- **Header**: Compact avec logo 8x8 sur mobile
- **Cartes**: Grid responsive (2 cols mobile, 4 desktop)
- **Textes**: text-lg mobile, text-2xl desktop
- **Espacement**: p-3 mobile, p-4 desktop

---

## [1.0.0] - 2025-06-26

### 🎉 Release Initiale
- **📊 Tableau de Bord**: Vue d'ensemble financière complète
- **💰 Gestion des Dépenses**: Ajout, historique, suppression
- **🎯 Gestion des Budgets**: Configuration par catégorie
- **👨‍👩‍👧‍👦 Vue Familiale**: Résumé et graphiques détaillés
- **⚙️ Paramètres**: Gestion des membres et données
- **💾 Sauvegarde**: Automatique en localStorage
- **🎨 Interface**: Design moderne avec Tailwind CSS
- **📱 Responsive**: Compatible mobile et desktop

### 🏗️ Architecture
- **React 18.3.1**: Framework UI moderne
- **Vite 5.4.0**: Build tool optimisé
- **Tailwind CSS 3.4.4**: Framework CSS utility-first
- **Lucide React**: Icônes modernes
- **LocalStorage**: Persistance des données

### 📊 Fonctionnalités Principales
- **Multi-membres**: Données isolées par membre de famille
- **Catégories**: 8 catégories de dépenses prédéfinies
- **Objectifs**: Suivi des objectifs d'épargne
- **Graphiques**: Barres de progression et analyses visuelles
- **Export**: Sauvegarde JSON des données

---

## Format du Changelog

Ce changelog suit les conventions de [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

### Types de Changements
- **🆕 Ajouté** pour les nouvelles fonctionnalités
- **🔧 Corrigé** pour les corrections de bugs
- **🎨 Amélioré** pour les changements dans les fonctionnalités existantes
- **🗑️ Supprimé** pour les fonctionnalités supprimées
- **🔒 Sécurité** pour les vulnérabilités corrigées
- **📊 Performance** pour les améliorations de performance
