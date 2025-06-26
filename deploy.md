# 🚀 Guide de Déploiement - Budget Familial v1.0.0

## 📦 Build de Production

Le build de production est déjà créé dans le dossier `dist/` avec les fichiers optimisés :

```
dist/
├── assets/
│   ├── index-BbloKTYi.css    # CSS optimisé (17KB)
│   └── index-Dl_wPzv5.js     # JavaScript optimisé (228KB)
├── budget_logo.png           # Logo de l'application
├── index.html               # Page principale
├── logo.svg                 # Logo SVG
└── vite.svg                 # Logo Vite
```

## 🌐 Options de Déploiement

### 1. GitHub Pages

#### Configuration automatique
```bash
# Installer gh-pages
npm install --save-dev gh-pages

# Ajouter au package.json
"scripts": {
  "deploy": "gh-pages -d dist"
}

# Déployer
npm run deploy
```

#### Configuration manuelle
1. Aller dans les paramètres du repository GitHub
2. Section "Pages" → Source: "Deploy from a branch"
3. Sélectionner la branche `gh-pages`
4. L'application sera disponible sur `https://[username].github.io/[repository]/`

### 2. Netlify

#### Déploiement par glisser-déposer
1. Aller sur [netlify.com](https://netlify.com)
2. Glisser-déposer le dossier `dist/` sur la zone de déploiement
3. L'application sera automatiquement déployée avec une URL unique

#### Déploiement via Git
1. Connecter le repository GitHub à Netlify
2. Configuration de build :
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. Déploiement automatique à chaque push

### 3. Vercel

#### Via CLI
```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel --prod
```

#### Via Dashboard
1. Importer le projet depuis GitHub
2. Configuration automatique détectée
3. Déploiement automatique

### 4. Serveur Web Classique

#### Apache/Nginx
1. Copier le contenu du dossier `dist/` vers le répertoire web
2. Configurer le serveur pour servir `index.html` pour toutes les routes
3. Exemple de configuration Apache :
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## 🔧 Configuration Avancée

### Variables d'Environnement
L'application fonctionne entièrement côté client, aucune variable d'environnement serveur n'est requise.

### Base URL
Si l'application est déployée dans un sous-dossier, modifier `vite.config.js` :
```javascript
export default defineConfig({
  base: '/mon-sous-dossier/',
  // ...
})
```

### HTTPS
Recommandé pour la production. La plupart des plateformes (Netlify, Vercel, GitHub Pages) fournissent HTTPS automatiquement.

## 📊 Monitoring et Analytics

### Performance
- Utiliser Lighthouse pour auditer les performances
- Bundle analyzer pour optimiser la taille
- Service Worker pour le cache (optionnel)

### Analytics
Ajouter Google Analytics ou autre solution de tracking si nécessaire.

## 🔒 Sécurité

### Headers de Sécurité
Configurer les headers de sécurité sur le serveur :
```
Content-Security-Policy: default-src 'self'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
```

### Données Utilisateur
- Toutes les données sont stockées localement (localStorage)
- Aucune donnée sensible n'est transmise au serveur
- Respect de la vie privée par design

## ✅ Checklist de Déploiement

- [x] Build de production créé (`npm run build`)
- [x] Tests en mode preview (`npm run preview`)
- [x] Documentation mise à jour (README.md)
- [x] Version taggée (v1.0.0)
- [ ] Plateforme de déploiement choisie
- [ ] Configuration DNS (si domaine personnalisé)
- [ ] Tests post-déploiement
- [ ] Monitoring configuré

## 🚨 Dépannage

### Erreurs Communes

**Page blanche après déploiement**
- Vérifier la configuration `base` dans `vite.config.js`
- Vérifier que tous les fichiers sont bien uploadés

**Erreur 404 sur les routes**
- Configurer le serveur pour servir `index.html` pour toutes les routes
- Vérifier la configuration de redirection

**Ressources non trouvées**
- Vérifier les chemins relatifs/absolus
- Vérifier la configuration `base` URL

## 📞 Support

Pour toute question sur le déploiement :
1. Vérifier la documentation de la plateforme choisie
2. Consulter les logs de build/déploiement
3. Tester localement avec `npm run preview`

---

**Application prête pour la production ! 🎉**
