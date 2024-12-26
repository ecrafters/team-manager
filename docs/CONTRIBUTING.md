# Guide de contribution

## Process de développement

1. Fork du projet
2. Création d'une branche pour la feature
3. Développement avec tests
4. Pull request vers main

## Standards de code

### Style

- Utiliser Prettier pour le formatage
- Suivre les règles ESLint
- Nommage explicite des variables/fonctions

### Architecture

- Composants autonomes
- Services pour la logique métier
- Interfaces pour le typage
- Tests unitaires requis

## Tests

### Unitaires
```bash
npm run test
```

### E2E
```bash
npm run e2e
```

## Documentation

- Documenter les nouvelles features
- Mettre à jour le README si nécessaire
- JSDoc pour les fonctions publiques