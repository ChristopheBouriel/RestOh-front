import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCartStore = create(
  persist(
    (set, get) => ({
      // État
      items: [],
      
      // Computed values - exposed as regular functions
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0)
      },

      // Actions
      addItem: (product) => {
        const items = get().items
        const existingItem = items.find(item => item.id === product.id)
        
        if (existingItem) {
          // Si l'item existe, augmenter la quantité
          set({
            items: items.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          })
        } else {
          // Sinon, ajouter le nouvel item
          set({
            items: [...items, { ...product, quantity: 1 }]
          })
        }
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter(item => item.id !== productId)
        })
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        
        set({
          items: get().items.map(item =>
            item.id === productId
              ? { ...item, quantity }
              : item
          )
        })
      },

      increaseQuantity: (productId) => {
        const item = get().items.find(item => item.id === productId)
        if (item) {
          get().updateQuantity(productId, item.quantity + 1)
        }
      },

      decreaseQuantity: (productId) => {
        const item = get().items.find(item => item.id === productId)
        if (item && item.quantity > 1) {
          get().updateQuantity(productId, item.quantity - 1)
        } else if (item && item.quantity === 1) {
          get().removeItem(productId)
        }
      },

      clearCart: () => {
        set({ items: [] })
      },

      // Utilitaires
      isItemInCart: (productId) => {
        return get().items.some(item => item.id === productId)
      },

      getItemQuantity: (productId) => {
        const item = get().items.find(item => item.id === productId)
        return item ? item.quantity : 0
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
)

export default useCartStore