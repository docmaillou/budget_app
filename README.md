# 💰 Budget Familial v1.0.0

Une application web moderne de gestion de budget familial avec interface graphique interactive.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.3.1-61dafb.svg)
![Vite](https://img.shields.io/badge/Vite-5.4.0-646cff.svg)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4.4-38bdf8.svg)

## 🚀 Fonctionnalités

### 📊 **Tableau de Bord Interactif**
- Vue d'ensemble financière complète
- Cartes de résumé avec métriques clés
- Objectif d'épargne avec progression visuelle
- Alertes de dépassement de budget

### 💸 **Gestion des Dépenses**
- Ajout rapide par catégorie
- **🎤 Saisie vocale intelligente** (nouveau !)
- Historique détaillé
- Attribution par membre de famille
- Suppression facile

### 🎯 **Budgets Intelligents**
- Configuration par catégorie
- Édition inline intuitive
- Barres de progression en temps réel
- Alertes automatiques

### 👨‍👩‍👧‍👦 **Vue Familiale Avancée**
- Résumé financier de toute la famille
- **Graphiques détaillés par membre** :
  - Analyse financière complète
  - Dépenses par catégorie
  - Progression des objectifs
  - Interface modal responsive

### ⚙️ **Gestion Complète**
- Membres de famille configurables
- Export/import des données
- Sauvegarde automatique locale
- Reset sécurisé

## 🛠️ Installation

### Prérequis
- Node.js 18+
- npm ou yarn

### Développement Local
```bash
# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev
```

### Build de Production
```bash
# Créer le build optimisé
npm run build

# Prévisualiser le build
npm run preview
```

## 🏗️ Architecture

### Structure des Composants
```
src/
├── components/
│   ├── Dashboard.jsx          # Tableau de bord principal
│   ├── ExpensesTab.jsx        # Gestion des dépenses
│   ├── BudgetTab.jsx          # Configuration budgets
│   ├── FamilyTab.jsx          # Vue familiale + graphiques
│   ├── SettingsTab.jsx        # Paramètres
│   └── FirstTimeSetup.jsx     # Configuration initiale
├── App.jsx                    # Composant principal
└── main.jsx                   # Point d'entrée
```

### Technologies Utilisées
- **React 18.3.1** - Framework UI
- **Vite 5.4.0** - Build tool moderne
- **Tailwind CSS 3.4.4** - Framework CSS
- **Lucide React** - Icônes modernes
- **LocalStorage** - Persistance des données

## 📱 Utilisation

### Premier Lancement
1. **Configuration initiale** : Ajoutez votre premier membre de famille
2. **Définir les budgets** : Configurez vos catégories de dépenses
3. **Ajouter des dépenses** : Commencez à tracker vos finances
4. **Suivre les progrès** : Consultez le tableau de bord

### Fonctionnalités Avancées
- **🎤 Commandes vocales** : Ajoutez des dépenses en parlant (Chrome/Edge/Safari)
- **Graphiques détaillés** : Cliquez sur "Voir détails" dans l'onglet Famille
- **Export des données** : Sauvegardez vos données via les Paramètres
- **Multi-membres** : Gérez plusieurs membres avec données isolées
- **Objectifs d'épargne** : Définissez et suivez vos objectifs

### 🎤 Reconnaissance Vocale
Dites simplement : *"Épicerie 25 euros courses alimentaires"* et l'application remplira automatiquement le formulaire !

**Formats supportés :**
- `"[Catégorie] [Montant] [Description]"`
- `"[Montant] euros [Catégorie] [Description]"`

**Navigateurs compatibles :** Chrome, Edge, Safari

## 💾 Gestion des Données

### Sauvegarde Automatique
- Toutes les données sont sauvegardées automatiquement dans le navigateur
- Persistance entre les sessions
- Pas de serveur requis

### Export/Import
- Export JSON complet via les Paramètres
- Sauvegarde manuelle possible
- Reset sécurisé avec confirmation

### Design Moderne
- Interface responsive (mobile/desktop)
- Thème cohérent bleu/gris
- Animations CSS fluides
- Icônes intuitives

**Développé avec ❤️ Par CharlyBoi pour simplifier la gestion de budget familial**
