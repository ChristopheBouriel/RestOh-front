# Guide Pragmatique des Tests Frontend - RestOh

*Basé sur l'expérience du développement du projet et les leçons apprises*

## 📋 Philosophie de Test RestOh

### ✅ CE QU'ON TESTE (Comportement Utilisateur)
- **Fonctionnalités métier** : L'utilisateur peut-il faire ce qu'il doit faire ?
- **Interactions utilisateur** : Les actions produisent-elles les bons résultats ?
- **États d'erreur critiques** : L'app gère-t-elle les cas d'erreur gracieusement ?
- **Flux business critiques** : Commande, authentification, réservation

### ❌ CE QU'ON ÉVITE (Détails d'Implémentation)
- **Structure DOM précise** : Nombre exact d'éléments, classes CSS spécifiques
- **États internes React** : useState, useEffect, optimisations
- **Détails cosmétiques** : Couleurs, espacements, animations
- **Tests exhaustifs** : Tous les cas possibles → Seulement les cas importants

## 🎯 Règles Pratiques

### 1. Test du Point de Vue Utilisateur
```javascript
✅ expect(screen.getByRole('button', { name: 'Ajouter au panier' })).toBeInTheDocument()
❌ expect(screen.getByClassName('btn-add-cart')).toBeInTheDocument()

✅ expect(screen.getByRole('heading', { name: 'Pizza Margherita', level: 3 })).toBeInTheDocument()
❌ expect(screen.getAllByText('Pizza Margherita')).toHaveLength(2) // image + titre
```

### 2. Focus sur les Cas d'Usage Métier
```javascript
✅ 'should filter items when user searches'
✅ 'should add item to cart when user clicks button'
✅ 'should show empty state when no results'
✅ 'should reset filters when reset button clicked'

❌ 'should have exactly 6 skeleton cards during loading'
❌ 'should maintain correct component state structure'
❌ 'should optimize re-renders with React.memo'
❌ 'should display icons with correct CSS classes'
```

### 3. Approche "Juste Ce Qu'il Faut"
Pour un composant comme `Menu.jsx`, **10-15 tests suffisent** :

```javascript
describe('Menu Component', () => {
  // 1. Rendu de base (2 tests)
  test('should render menu header and search form')
  test('should display menu items by default')
  
  // 2. Fonctionnalités principales (4 tests)  
  test('should filter items when user types in search')
  test('should filter by category when user selects option')
  test('should sort items when user changes sort option')
  test('should call addItem when user clicks add to cart')
  
  // 3. États importants (3 tests)
  test('should show loading state when data is loading')
  test('should show empty state when no items match filters')
  test('should reset all filters when reset button clicked')
  
  // 4. Cas limites (1-2 tests max)
  test('should handle empty menu data gracefully')
})
// Total : ~10 tests au lieu de 45+
```

## 🛠️ Configuration Simplifiée

### Mocking Simple et Robuste
```javascript
// ✅ Approche simple
vi.mock('../hooks/useMenu')
vi.mock('../hooks/useCart')

describe('Component', () => {
  beforeEach(() => {
    vi.mocked(useMenu).mockReturnValue({
      availableItems: mockData,
      categories: mockCategories,
      isLoading: false
    })
    
    vi.mocked(useCart).mockReturnValue({
      addItem: vi.fn()
    })
  })
})

// ❌ Approche complexe à éviter
let mockUseMenu = { ... }
// Avec des resets compliqués et des variables globales
```

### Mock Seulement ce qui est Nécessaire
```javascript
✅ // Mock les dépendances directes
vi.mock('../hooks/useAuth')
vi.mock('../hooks/useCart')

❌ // Mock tout l'écosystème (sauf si vraiment nécessaire)
vi.mock('react-router-dom')
vi.mock('react-hot-toast')
vi.mock('../components/ImageWithFallback')
vi.mock('lucide-react')
```

## 📊 Structure de Test par Type de Composant

### 1. Pages/Écrans (10-15 tests)
- Rendu initial
- Fonctionnalités principales (3-5 tests)
- États (loading, empty, error)
- Navigation/routing

### 2. Composants Formulaire (8-12 tests)
- Rendu des champs
- Validation (cas valides + invalides)
- Soumission
- Gestion d'erreurs

### 3. Composants d'Affichage (5-8 tests)
- Rendu avec données
- Gestion du contenu vide
- Interactions de base (si applicable)

### 4. Hooks/Stores (8-15 tests)
- Actions principales
- Calculs métier
- États d'erreur
- Persistance (si applicable)

## 🚨 Signaux d'Alarme (Over-Testing)

**Arrêtez-vous si :**
- Vous avez plus de 20 tests pour un composant simple
- Vous testez la même chose de 5 façons différentes
- Vos tests cassent à chaque petit changement CSS/HTML
- Vous passez plus de temps sur les tests que sur le code
- Vous testez des détails internes de React
- Vous comptez des éléments DOM spécifiques

## 💡 Exemples Concrets RestOh

### ✅ Bon Test (Fonctionnel)
```javascript
test('should add pizza to cart when user clicks add button', async () => {
  const mockAddItem = vi.fn()
  vi.mocked(useCart).mockReturnValue({ addItem: mockAddItem })
  
  render(<Menu />)
  
  const addButton = screen.getAllByText('Ajouter au panier')[0]
  await user.click(addButton)
  
  expect(mockAddItem).toHaveBeenCalledWith(
    expect.objectContaining({ name: 'Pizza Margherita' })
  )
})
```

### ❌ Mauvais Test (Détails d'implémentation)
```javascript
test('should display pizza category with correct CSS classes', () => {
  render(<Menu />)
  
  const categoryBadge = screen.getByText('pizza')
  expect(categoryBadge).toHaveClass(
    'text-xs', 'font-medium', 'text-primary-600', 
    'bg-primary-50', 'px-2', 'py-1', 'rounded', 'capitalize'
  )
})
```

## 🎯 Balance Effort/Valeur

### 🟢 High Value / Low Effort (PRIORITÉ)
- Actions utilisateur critiques (login, add to cart, submit form)
- Affichage conditionnel (loading, error, empty states)
- Navigation de base
- Validation de formulaires

### 🟡 Medium Value / Medium Effort 
- Filtrage et tri complexe
- Gestion d'erreurs spécifiques
- Intégration entre composants

### 🔴 Low Value / High Effort (ÉVITER)
- Tests de style et layout
- Tests d'optimisation performance
- Cas d'erreur ultra-spécifiques
- Tests de détails d'animation

## 📋 Checklist Avant de Committer des Tests

- [ ] Les tests se lisent comme des spécifications utilisateur
- [ ] Moins de 20 tests par composant (sauf cas très complexe)
- [ ] Pas de tests qui cassent pour des changements CSS mineurs
- [ ] Mocks simples et compréhensibles
- [ ] Tous les tests passent et sont rapides (< 2s total)

## 🔄 Évolution du Guide

Ce guide sera mis à jour en fonction de :
- L'expérience acquise sur le projet RestOh
- Les problèmes de maintenance rencontrés
- L'évolution des besoins métier
- Les retours de l'équipe de développement

---

### 💬 Principe Directeur

> *"Le meilleur test est celui qui donne le maximum de confiance dans la fonctionnalité avec le minimum d'effort de maintenance."*

**Un bon test :**
- ✅ Se lit comme une spécification métier
- ✅ Est indépendant des détails d'implémentation  
- ✅ Donne confiance que la fonctionnalité marche
- ✅ Est facile à maintenir et comprendre

**Un mauvais test :**
- ❌ Casse dès qu'on refactor le code
- ❌ Teste des détails techniques plutôt que l'usage
- ❌ Prend plus de temps à maintenir qu'il n'apporte de valeur
- ❌ Duplique d'autres tests sans valeur ajoutée

### 📚 Ressources Essentielles
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) - Philosophy + API
- [Common Testing Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library) - Kent C. Dodds
- [Testing Implementation Details](https://kentcdodds.com/blog/testing-implementation-details) - Pourquoi les éviter