import { useState } from 'react'
import { Search, Filter } from 'lucide-react'

const Menu = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('name')

  const categories = [
    { id: 'all', name: 'Tous les plats' },
    { id: 'entrees', name: 'Entrées' },
    { id: 'plats', name: 'Plats Principaux' },
    { id: 'desserts', name: 'Desserts' },
    { id: 'boissons', name: 'Boissons' },
  ]

  // Données temporaires - seront remplacées par l'API
  const menuItems = [
    {
      id: 1,
      name: 'Pizza Margherita',
      price: 15.90,
      category: 'plats',
      description: 'Base tomate, mozzarella, basilic frais, huile d\'olive',
      image: null,
      rating: 4.5,
      reviews: 23
    },
    {
      id: 2,
      name: 'Salade César',
      price: 12.50,
      category: 'entrees',
      description: 'Salade verte, croûtons, parmesan, sauce César maison',
      image: null,
      rating: 4.2,
      reviews: 18
    },
    {
      id: 3,
      name: 'Burger Gourmand',
      price: 18.00,
      category: 'plats',
      description: 'Bœuf angus, cheddar, bacon, légumes frais, frites maison',
      image: null,
      rating: 4.7,
      reviews: 31
    },
    {
      id: 4,
      name: 'Tiramisu Maison',
      price: 7.50,
      category: 'desserts',
      description: 'Mascarpone, café, cacao, biscuits à la cuillère',
      image: null,
      rating: 4.8,
      reviews: 15
    },
  ]

  const filteredItems = menuItems
    .filter(item => selectedCategory === 'all' || item.category === selectedCategory)
    .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price
        case 'rating':
          return b.rating - a.rating
        default:
          return a.name.localeCompare(b.name)
      }
    })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="text-sm breadcrumbs mb-4">
            <span className="text-gray-500">Accueil</span>
            <span className="mx-2 text-gray-400">&gt;</span>
            <span className="text-primary-600 font-medium">Menu</span>
          </nav>
          
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Notre Menu
          </h1>
          <p className="text-lg text-gray-600">
            Découvrez notre sélection de plats préparés avec passion
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtres et Recherche */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Barre de recherche */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un plat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-4">
              {/* Filtre par catégorie */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              {/* Tri */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="name">Nom A-Z</option>
                <option value="price">Prix croissant</option>
                <option value="rating">Meilleures notes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grille des plats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {/* Image placeholder */}
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">Image du plat</span>
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-primary-600 font-medium capitalize">
                    {item.category}
                  </span>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1">{item.rating}</span>
                    <span className="ml-1">({item.reviews})</span>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.name}
                </h3>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {item.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-primary-600">
                    {item.price.toFixed(2)}€
                  </span>
                  <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium">
                    + Panier
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message si aucun résultat */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Aucun plat ne correspond à vos critères de recherche.
            </p>
          </div>
        )}

        {/* Bouton charger plus (placeholder) */}
        {filteredItems.length > 0 && (
          <div className="text-center mt-8">
            <button className="bg-white text-primary-600 border-2 border-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 hover:text-white transition-colors">
              Charger plus...
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Menu