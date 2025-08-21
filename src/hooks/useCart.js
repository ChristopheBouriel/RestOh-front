import { toast } from 'react-hot-toast'
import useCartStore from '../store/cartStore'

export const useCart = () => {
  const {
    items,
    isOpen,
    getTotalItems,
    getTotalPrice,
    addItem,
    removeItem,
    updateQuantity,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    isItemInCart,
    getItemQuantity
  } = useCartStore()

  const totalItems = getTotalItems()
  const totalPrice = getTotalPrice()

  const handleAddItem = (product) => {
    addItem(product)
    toast.success(`${product.name} ajouté au panier`)
    // Ouvrir brièvement le panier pour feedback visuel
    setTimeout(() => {
      if (!isOpen) openCart()
      setTimeout(() => closeCart(), 2000)
    }, 100)
  }

  const handleRemoveItem = (productId, productName) => {
    removeItem(productId)
    toast.success(`${productName} retiré du panier`)
  }

  const handleUpdateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      const item = items.find(item => item.id === productId)
      if (item) {
        handleRemoveItem(productId, item.name)
      }
    } else {
      updateQuantity(productId, quantity)
    }
  }

  const handleClearCart = () => {
    clearCart()
    toast.success('Panier vidé')
    closeCart()
  }

  // Formatage du prix
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price)
  }

  return {
    // État
    items,
    isOpen,
    totalItems,
    totalPrice: totalPrice,
    formattedTotalPrice: formatPrice(totalPrice),
    isEmpty: items.length === 0,

    // Actions avec feedback
    addItem: handleAddItem,
    removeItem: handleRemoveItem,
    updateQuantity: handleUpdateQuantity,
    increaseQuantity,
    decreaseQuantity,
    clearCart: handleClearCart,
    
    // UI
    toggleCart,
    openCart,
    closeCart,
    
    // Utilitaires
    isItemInCart,
    getItemQuantity,
    formatPrice
  }
}