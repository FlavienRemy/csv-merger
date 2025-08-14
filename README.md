# CSV Merger

Un outil web moderne pour fusionner des fichiers CSV avec une interface utilisateur intuitive et des fonctionnalités avancées.

## 🚀 Fonctionnalités

- **Upload de fichiers CSV** avec drag & drop et file picker
- **Sélection de colonnes de jointure** pour chaque fichier
- **Types de fusion multiples** : Left Join, Right Join, Inner Join, Outer Join
- **Gestion intelligente des conflits** : les colonnes en conflit sont automatiquement détectées et résolues
- **Aperçu des données** avant téléchargement
- **Statistiques détaillées** de la fusion
- **Interface responsive** et moderne
- **Déploiement Docker** simple et rapide

## 🛠️ Technologies

- **Frontend** : React 19 + TypeScript
- **Styling** : Tailwind CSS
- **State Management** : Zustand
- **CSV Parsing** : Papa Parse
- **Build Tool** : Vite

## 📋 Prérequis

- Node.js 18+

## 🚀 Installation et Démarrage

### Développement Local

1. **Cloner le repository**
   ```bash
   git clone <repository-url>
   cd csv-merger
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Démarrer le serveur de développement**
   ```bash
   npm run dev
   ```

4. **Ouvrir l'application**
   - Naviguez vers `http://localhost:5173`



## 📖 Utilisation

### 1. Upload des fichiers
- Glissez-déposez vos fichiers CSV ou utilisez le bouton "Sélectionner un fichier"
- Le fichier principal servira de base pour la fusion
- Le fichier secondaire sera fusionné avec le fichier principal

### 2. Configuration de la fusion
- Sélectionnez les colonnes de jointure pour chaque fichier
- Choisissez le type de fusion souhaité :
  - **Left Join** : Toutes les lignes du fichier principal (par défaut)
  - **Right Join** : Toutes les lignes du fichier secondaire
  - **Inner Join** : Lignes communes aux deux fichiers
  - **Outer Join** : Toutes les lignes des deux fichiers

### 3. Résolution des conflits
- Les colonnes en conflit sont automatiquement détectées
- Les valeurs du fichier principal sont conservées
- Un aperçu des colonnes ignorées est affiché

### 4. Téléchargement
- Cliquez sur "Fusionner les fichiers" pour effectuer la fusion
- Consultez les statistiques et l'aperçu des données
- Téléchargez le fichier fusionné

## 🔧 Scripts Disponibles

```bash
# Développement
npm run dev              # Démarrer le serveur de développement (port 5173)
npm run build            # Construire pour la production
npm run preview          # Prévisualiser la build de production
npm run lint             # Linter le code
```

## 📁 Structure du Projet

```
csv-merger/
├── src/
│   ├── components/          # Composants React
│   │   ├── FileUpload.tsx
│   │   ├── MergeConfiguration.tsx
│   │   ├── ColumnConflicts.tsx
│   │   ├── ResultDisplay.tsx
│   │   └── ErrorDisplay.tsx
│   ├── store/              # Gestion d'état Zustand
│   │   └── csvStore.ts
│   ├── types/              # Types TypeScript
│   │   └── csv.ts
│   ├── utils/              # Utilitaires
│   │   └── csvUtils.ts
│   ├── App.tsx             # Composant principal
│   └── index.css           # Styles Tailwind
├── Dockerfile              # Dockerfile de production
├── Dockerfile.dev          # Dockerfile de développement
├── docker-compose.yml      # Configuration Docker Compose
├── nginx.conf              # Configuration Nginx
└── README.md
```



## 🔒 Sécurité

- Headers de sécurité configurés dans Nginx
- Validation des types avec TypeScript
- Gestion des erreurs robuste
- Pas de stockage de données côté serveur

## 🤝 Contribution

1. Fork le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Si vous rencontrez des problèmes ou avez des questions :

1. Vérifiez que tous les prérequis sont installés
2. Consultez les logs Docker si vous utilisez Docker
3. Ouvrez une issue sur GitHub avec les détails du problème

## 🎯 Roadmap

- [ ] Support pour d'autres formats de fichiers (Excel, JSON)
- [ ] Historique des fusions
- [ ] Templates de configuration
- [ ] API REST pour l'intégration
- [ ] Tests unitaires et d'intégration
- [ ] Mode sombre
- [ ] Export vers différents formats
