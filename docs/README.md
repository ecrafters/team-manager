# Team Management Platform

## Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture](#architecture)
3. [Fonctionnalités](#fonctionnalités)
4. [Installation](#installation)
5. [Configuration](#configuration)
6. [Guide d'utilisation](#guide-dutilisation)
7. [API](#api)
8. [Sécurité](#sécurité)

## Vue d'ensemble

Team Management Platform est une application web moderne pour la gestion d'équipes et de projets. Elle permet de :
- Gérer les membres de l'équipe
- Suivre les projets
- Gérer les absences
- Monitorer la charge de travail
- Générer des rapports

### Technologies utilisées

- Frontend : Angular 18
- Backend : Firebase
- Base de données : Firestore
- Authentification : Firebase Auth
- UI : Custom components avec design system intégré

## Architecture

### Structure du projet

```
src/
├── app/
│   ├── core/           # Services et utilitaires core
│   ├── features/       # Modules fonctionnels
│   ├── shared/         # Composants partagés
│   └── app.component.ts
├── environments/       # Configuration par environnement
└── assets/            # Ressources statiques
```

### Modules fonctionnels

- **Dashboard** : Vue d'ensemble et KPIs
- **Team** : Gestion des membres
- **Projects** : Gestion de projets
- **Absences** : Gestion des absences
- **Workload** : Suivi de charge
- **Reports** : Rapports et analytics

## Fonctionnalités

### Gestion d'équipe

- Ajout/modification/suppression de membres
- Profils détaillés
- Rôles et permissions
- Départements

### Gestion de projets

- Création et suivi de projets
- Attribution des ressources
- Suivi d'avancement
- États multiples (actif, terminé, en pause)

### Gestion des absences

- Demandes d'absence
- Workflow de validation
- Types d'absence (congés, maladie, télétravail)
- Calendrier des absences

### Suivi de charge

- Allocation par membre
- Vue par projet
- Alertes de surcharge
- Historique

## Installation

1. Prérequis
```bash
node >= 18.0.0
npm >= 9.0.0
```

2. Installation des dépendances
```bash
npm install
```

3. Configuration Firebase
   - Créer un projet Firebase
   - Activer Authentication et Firestore
   - Copier les credentials dans `environment.ts`

4. Démarrage
```bash
npm run dev
```

## Configuration

### Firebase

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: "your-api-key",
    authDomain: "your-domain.firebaseapp.com",
    projectId: "your-project-id",
    // ...
  }
};
```

### Rôles et permissions

```typescript
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  DEVELOPER = 'developer'
}
```

## Guide d'utilisation

### Authentification

1. Créer un compte via le formulaire d'inscription
2. Se connecter avec email/mot de passe
3. Accès au dashboard après connexion

### Gestion des membres

1. Accéder à "Équipe"
2. Utiliser "Nouveau membre" pour ajouter
3. Remplir les informations requises
4. Gérer via les actions disponibles

### Gestion des projets

1. Accéder à "Projets"
2. Créer un nouveau projet
3. Assigner les membres
4. Suivre l'avancement

### Gestion des absences

1. Accéder à "Absences"
2. Créer une demande
3. Attendre la validation
4. Suivre le statut

## API

### Services principaux

#### AuthService
```typescript
login(email: string, password: string): Observable<User>
logout(): Observable<void>
isAuthenticated(): Observable<boolean>
```

#### TeamService
```typescript
getTeamMembers(): Observable<TeamMember[]>
addMember(member: TeamMember): Observable<string>
updateMember(id: string, member: Partial<TeamMember>): Observable<void>
```

#### ProjectService
```typescript
getProjects(): Observable<Project[]>
addProject(project: Project): Observable<string>
updateProject(id: string, project: Partial<Project>): Observable<void>
```

## Sécurité

### Authentification

- Authentification Firebase
- JWT tokens
- Sessions sécurisées

### Autorisations

Règles Firestore pour contrôle d'accès :
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Règles de sécurité par collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    // ...
  }
}
```

### Protection des données

- Validation des entrées
- Sanitization des données
- Encryption des données sensibles