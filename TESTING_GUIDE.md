# Guide Complet des Tests Frontend - RestOh

Ce fichier contient toutes les informations nécessaires pour implémenter des tests efficaces dans l'application RestOh, basé sur les meilleures pratiques React 2024.

## 📋 Résumé Exécutif

### Philosophie de Test
**Principe fondamental** : "Plus vos tests ressemblent à la façon dont votre logiciel est utilisé, plus ils peuvent vous donner confiance."

### Stack de Test Recommandée
- **Jest** : Test runner avec assertions, mocks, organisation des tests
- **React Testing Library (RTL)** : Tests centrés utilisateur pour les composants
- **Mock Service Worker (MSW)** : Mock des appels réseau
- **@testing-library/jest-dom** : Matchers personnalisés pour le DOM

## 🎯 Ce qu'il FAUT tester

### 1. Logique Métier (Stores Zustand)

#### Tests Prioritaires
```javascript
✅ Actions des stores (createOrder, login, deleteAccount, etc.)
✅ Mutations d'état et calculs métier 
✅ Validation des données d'entrée
✅ Gestion des erreurs et états de loading
✅ Logique de persistance localStorage
✅ Fonctions utilitaires métier (formatPrice, validateEmail, etc.)
```

#### Exemple de Test Store
```javascript
describe('authStore', () => {
  beforeEach(() => {
    // Reset store entre chaque test
    useAuthStore.getState().reset()
  })

  test('should login with valid credentials', async () => {
    const { login } = useAuthStore.getState()
    const result = await login({ email: 'admin@restoh.fr', password: 'admin123' })
    
    expect(result.success).toBe(true)
    expect(useAuthStore.getState().isAuthenticated).toBe(true)
  })
})
```

### 2. Composants React (Interface Utilisateur)

#### Tests Prioritaires
```javascript
✅ Rendu initial des composants
✅ Interactions utilisateur (clicks, form submissions, navigation)
✅ Mise à jour de l'UI suite aux actions utilisateur
✅ Affichage conditionnel basé sur l'état
✅ Accessibilité (aria-labels, rôles, focus)
✅ Validation des formulaires côté client
```

#### Exemple de Test Composant
```javascript
describe('LoginForm', () => {
  test('should display error for invalid credentials', async () => {
    render(<LoginForm />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/mot de passe/i)
    const submitButton = screen.getByRole('button', { name: /connexion/i })
    
    await user.type(emailInput, 'invalid@email.com')
    await user.type(passwordInput, 'wrongpassword')
    await user.click(submitButton)
    
    expect(await screen.findByText(/identifiants incorrects/i)).toBeInTheDocument()
  })
})
```

### 3. Hooks Personnalisés

#### Tests Prioritaires  
```javascript
✅ Logique d'état complexe
✅ Effets de bord et nettoyage
✅ Valeurs de retour et callbacks
✅ Gestion d'erreurs dans les hooks
```

#### Exemple de Test Hook
```javascript
describe('useAuth', () => {
  test('should handle login flow', async () => {
    const { result } = renderHook(() => useAuth())
    
    await act(async () => {
      await result.current.login({ email: 'test@test.com', password: 'password' })
    })
    
    expect(result.current.isAuthenticated).toBe(true)
  })
})
```

## 🚫 Ce qu'il NE FAUT PAS tester

### Détails d'Implémentation
```javascript
❌ État interne des composants (useState, useEffect)
❌ Props et state des composants (testez le comportement, pas l'implémentation)
❌ Méthodes de cycle de vie React
❌ Noms de variables ou structure du code
```

### Fonctionnalités des Frameworks/Libraries
```javascript
❌ Fonctionnement de React Router (navigation testée par l'équipe React)
❌ Fonctionnement de Zustand (persistance testée par l'équipe Zustand)
❌ Validation de Tailwind CSS (styles testés par l'équipe Tailwind)
❌ Fonctionnement de React Hot Toast (notifications testées par l'équipe)
```

### Tiers Externes
```javascript
❌ APIs externes (utilisez des mocks)
❌ Bibliothèques tierces bien établies
❌ Navigateurs et leurs APIs natives
```

## 📁 Structure des Tests Recommandée

```
src/
├── __tests__/              # Tests globaux et utilitaires
├── components/
│   ├── Component.jsx
│   └── __tests__/
│       └── Component.test.jsx
├── hooks/
│   ├── useHook.js  
│   └── __tests__/
│       └── useHook.test.js
├── store/
│   ├── store.js
│   └── __tests__/
│       └── store.test.js
└── utils/
    ├── helpers.js
    └── __tests__/
        └── helpers.test.js
```

## 🛠️ Configuration Spécifique RestOh

### Setup des Mocks Zustand

```javascript
// __mocks__/zustand.js
import { act } from '@testing-library/react'

const storeResetFns = new Set()

const createStore = (createState) => {
  const store = actualCreate(createState)
  const initialState = store.getState()
  storeResetFns.add(() => store.setState(initialState, true))
  return store
}

// Reset après chaque test
afterEach(() => {
  act(() => storeResetFns.forEach(resetFn => resetFn()))
})
```

### Tests d'Intégration Critiques RestOh

#### Workflow Commande Complète
```javascript
test('complete order flow', async () => {
  // 1. Ajouter produits au panier
  // 2. Aller au checkout  
  // 3. Valider commande
  // 4. Vérifier persistance dans ordersStore
})
```

#### Workflow Authentification
```javascript
test('authentication flow with RGPD deletion', async () => {
  // 1. Créer compte
  // 2. Se connecter
  // 3. Supprimer compte (test RGPD)
  // 4. Vérifier anonymisation des données
})
```

## 📊 Types de Tests par Priorité

### 1. Tests Unitaires (Haute Priorité)
- **Stores Zustand** : Logique métier pure
- **Utilitaires** : Fonctions helpers (formatPrice, crypto, validation)
- **Hooks personnalisés** : useAuth, useReservations, etc.

### 2. Tests d'Intégration (Priorité Moyenne)
- **Flux complets** : Commande, réservation, authentification
- **Communication Store ↔ Component**
- **Persistance localStorage**

### 3. Tests E2E (Priorité Faible)
- **Parcours utilisateur critiques**
- **Responsive design**
- **Performance**

## 🎯 Couverture de Code Cible

```javascript
// Objectifs de couverture
Stores (logique métier)     : 90-95%
Hooks personnalisés         : 85-90%
Composants critiques        : 80-85%
Utilitaires                 : 95%
```

## 🧪 Patterns de Test RestOh

### Pattern AAA (Arrange, Act, Assert)
```javascript
test('should update user profile', async () => {
  // Arrange - Préparer
  const initialUser = { name: 'John', email: 'john@test.com' }
  const updatedData = { name: 'Jane', phone: '0123456789' }
  
  // Act - Agir
  render(<ProfileForm user={initialUser} />)
  await user.type(screen.getByLabelText(/nom/i), updatedData.name)
  await user.click(screen.getByRole('button', { name: /sauvegarder/i }))
  
  // Assert - Vérifier
  expect(screen.getByDisplayValue('Jane')).toBeInTheDocument()
})
```

### Mock des Appels Réseau (MSW)
```javascript
// Simuler les futures APIs
server.use(
  rest.post('/api/orders', (req, res, ctx) => {
    return res(ctx.json({ id: 'order-123', status: 'created' }))
  })
)
```

## 🚀 Commandes de Test

```bash
# Installation dépendances
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event msw

# Lancer les tests
npm test                    # Mode watch
npm test -- --coverage     # Avec couverture
npm test -- --verbose      # Mode verbeux
npm test stores             # Tests spécifiques aux stores
```

## 📝 Checklist avant Intégration Backend

### Tests à Maintenir
- [x] Logique métier des stores (indépendante de l'API)
- [x] Validation côté client
- [x] Formatage et utilitaires
- [x] Interactions utilisateur pures (UI)

### Tests à Adapter
- [ ] Simulation d'appels API → Vrais appels HTTP
- [ ] Mocks localStorage → Tests avec vraie persistance
- [ ] États de loading simulés → Tests avec vraies latences

## 💡 Anti-Patterns à Éviter

```javascript
❌ Testing implementation details
test('component has correct internal state', () => {
  expect(wrapper.state('count')).toBe(5) // ❌ État interne
})

✅ Testing user-visible behavior  
test('displays updated count after click', () => {
  expect(screen.getByText('Count: 5')).toBeInTheDocument() // ✅ Comportement visible
})
```

## 📚 Ressources et Documentation

- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Zustand Testing Guide](https://zustand.docs.pmnd.rs/guides/testing)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [MSW Documentation](https://mswjs.io/docs/)

---

**Ce guide doit être utilisé comme référence pour tous les futurs développements de tests dans RestOh. Il sera mis à jour selon l'évolution du projet et des meilleures pratiques.**