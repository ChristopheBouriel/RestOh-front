# RestOh - Application de Gestion de Restaurant

Une application complète de gestion de restaurant développée avec React, Vite et Tailwind CSS, offrant une expérience utilisateur moderne et des fonctionnalités d'administration avancées.

## 🚀 Fonctionnalités Principales

### 👥 **Authentification & Gestion Utilisateurs**
- **Inscription/Connexion** avec validation des formulaires
- **Comptes par défaut** : Admin (`admin@restoh.fr` / `admin123`) et Client test (`client@example.com` / `client123`)
- **Hachage sécurisé** des mots de passe (SHA-256)
- **Gestion du profil** utilisateur avec informations personnelles et préférences
- **Suppression de compte RGPD-compliant** avec anonymisation des données
- **Système de rôles** (admin/user) avec routes protégées

### 🍽️ **Menu & Commandes**
- **Catalogue de plats** avec catégories (entrées, plats, desserts, boissons)
- **Panier intelligent** par utilisateur avec persistance
- **Checkout sécurisé** avec choix du mode de paiement
- **Logique de paiement automatisée** :
  - Carte bancaire → paiement immédiat
  - Espèces → paiement à la réception
- **Suivi des commandes** en temps réel avec statuts multiples

### 🪑 **Système de Réservations**
- **Réservation de tables** avec sélection date/heure/nombre de personnes
- **Gestion des créneaux** et validation des disponibilités  
- **Demandes spéciales** et informations de contact
- **Historique des réservations** pour chaque utilisateur

### ⚙️ **Panel d'Administration Complet**

#### 📊 **Dashboard Analytics**
- **Statistiques en temps réel** : revenus, commandes, réservations, utilisateurs
- **Graphiques visuels** et métriques de performance
- **Aperçu des activités récentes**

#### 🍜 **Gestion du Menu**
- **CRUD complet** des plats (ajout, modification, suppression)
- **Gestion des catégories** et des prix
- **Images et descriptions** des produits

#### 📦 **Gestion des Commandes**
- **Tableau de bord des commandes** avec filtres et recherche
- **Mise à jour des statuts** : En attente → Confirmée → Préparation → Prête → Livrée
- **Système de couleurs pour comptes supprimés** :
  - 🟫 Gris : Commandes livrées/annulées d'utilisateurs supprimés
  - 🟠 Orange : Commandes payées en cours d'utilisateurs supprimés  
  - 🔴 Rouge : Commandes non payées d'utilisateurs supprimés
- **Détails complets** des commandes avec modalités de paiement

#### 🪑 **Gestion des Réservations**
- **Planning des réservations** avec vue calendaire
- **Gestion des statuts** : Confirmée, En attente, Annulée
- **Informations clients** et demandes spéciales

#### 👤 **Gestion des Utilisateurs**
- **Base de données utilisateurs** avec statistiques d'activité
- **Rôles et permissions** (admin/user)
- **Historique des connexions** et données d'activité
- **Statistiques par utilisateur** : commandes, dépenses, réservations

#### 📧 **Gestion des Messages/Contacts**
- **Réception automatique** des messages du formulaire de contact
- **Système de statuts** : Nouveau, Lu, Répondu
- **Badge de notification** avec compteur de nouveaux messages
- **Interface de gestion** avec filtres et statistiques
- **Actions disponibles** : marquer comme lu/répondu, supprimer
- **Modal de détail** avec informations complètes du contact

### 🔒 **Sécurité & Conformité RGPD**
- **Suppression de compte sécurisée** avec double confirmation
- **Anonymisation automatique** des données lors de la suppression
- **Préservation des statistiques** business tout en respectant la vie privée
- **Nettoyage complet** des données personnelles dans tous les stores
- **Hachage des mots de passe** avec vérification sécurisée

## 🛠️ Technologies Utilisées

### **Frontend**
- **React 18** - Framework UI moderne
- **Vite** - Build tool ultra-rapide
- **Tailwind CSS** - Framework CSS utility-first
- **React Router Dom** - Routing côté client
- **Lucide React** - Bibliothèque d'icônes

### **State Management**
- **Zustand** - Gestion d'état légère et performante
- **Persistance localStorage** - Sauvegarde automatique des données
- **Architecture modulaire** - Stores séparés par fonctionnalité

### **Fonctionnalités Avancées**
- **React Hot Toast** - Notifications utilisateur
- **Crypto API** - Hachage sécurisé des mots de passe
- **Responsive Design** - Interface adaptative mobile/desktop
- **Components réutilisables** - Architecture modulaire

## 📁 Structure du Projet

```
src/
├── components/           # Composants réutilisables
│   ├── common/          # Composants génériques
│   ├── layout/          # Layout et navigation
│   ├── admin/           # Composants admin
│   └── profile/         # Composants profil
├── pages/               # Pages de l'application  
│   ├── public/          # Pages publiques
│   ├── auth/            # Authentification
│   ├── admin/           # Panel admin
│   ├── profile/         # Gestion profil
│   ├── menu/            # Catalogue produits
│   ├── checkout/        # Process commande
│   ├── orders/          # Suivi commandes
│   └── reservations/    # Gestion réservations
├── store/               # Gestion d'état Zustand
│   ├── authStore.js     # Authentification
│   ├── cartStore.js     # Panier
│   ├── menuStore.js     # Menu
│   ├── ordersStore.js   # Commandes
│   ├── reservationsStore.js # Réservations
│   ├── usersStore.js    # Utilisateurs
│   └── contactsStore.js # Messages/Contacts
├── hooks/               # Custom hooks React
├── utils/               # Utilitaires et helpers
└── constants/           # Constantes et configuration
```

## 🚀 Installation & Lancement

### Prérequis
- Node.js (v18+)
- npm ou yarn

### Installation
```bash
# Cloner le repository
git clone https://github.com/ChristopheBouriel/RestOh-front.git

# Installer les dépendances
cd restOh-front
npm install

# Lancer en mode développement
npm run dev

# Build pour production
npm run build
```

## 👤 Comptes de Test

### Administrateur
- **Email** : `admin@restoh.fr`
- **Mot de passe** : `admin123`
- **Accès** : Panel admin complet

### Client Test
- **Email** : `client@example.com`  
- **Mot de passe** : `client123`
- **Accès** : Fonctionnalités utilisateur

## 🔧 Fonctionnalités Techniques

### **Gestion des États**
- **Auth Store** : Session utilisateur et authentification
- **Cart Store** : Panier par utilisateur avec synchronisation
- **Menu Store** : Catalogue produits et catégories
- **Orders Store** : Système de commandes avec logique métier
- **Reservations Store** : Planning et gestion des réservations
- **Users Store** : Base utilisateurs avec statistiques
- **Contacts Store** : Messages de contact et gestion admin

### **Sécurité**
- Routes protégées par rôle
- Validation des formulaires
- Sanitisation des données
- Conformité RGPD

### **Performance**
- Lazy loading des composants
- Optimisation des rendus React
- Persistance locale intelligente
- Interface responsive

## 📈 Statistiques Implémentées

### **Dashboard Admin**
- Revenus totaux et par période
- Nombre de commandes par statut
- Taux de conversion et satisfaction
- Utilisateurs actifs et nouveaux
- Performance des produits

### **Analytics Utilisateurs**  
- Historique des commandes et montants
- Fréquence de commande
- Produits favoris
- Réservations effectuées

## 🎯 Points Forts de l'Application

- ✅ **Interface moderne** et intuitive
- ✅ **Gestion complète** du cycle de vie restaurant
- ✅ **Conformité RGPD** avec suppression sécurisée
- ✅ **Administration puissante** avec analytics
- ✅ **Architecture scalable** et maintenable
- ✅ **Performance optimisée** avec Vite et React
- ✅ **Responsive design** mobile-first
- ✅ **Système de couleurs intelligent** pour la gestion des comptes supprimés

---

**RestOh** - Une solution complète de gestion de restaurant alliant technologie moderne et expérience utilisateur optimale.
