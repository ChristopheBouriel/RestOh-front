import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useOrdersStore = create(
  persist(
    (set, get) => ({
      // État
      orders: [],
      isLoading: false,

      // Actions
      setLoading: (loading) => set({ isLoading: loading }),

      // Initialiser avec des données de test
      initializeOrders: () => {
        const stored = localStorage.getItem('admin-orders')
        if (stored) {
          set({ orders: JSON.parse(stored) })
        } else {
          // Données initiales pour la démo
          const initialOrders = [
            {
              id: 'order-001',
              userId: 'client',
              userEmail: 'client@example.com',
              userName: 'Client',
              items: [
                { id: 1, name: 'Pizza Margherita', price: 15.90, quantity: 2, image: 'pizza-margherita.jpg' },
                { id: 2, name: 'Salade César', price: 12.50, quantity: 1, image: 'salade-cesar.jpg' }
              ],
              totalAmount: 44.30,
              status: 'pending', // pending, confirmed, preparing, ready, delivered, cancelled
              paymentMethod: 'card',
              isPaid: false,
              createdAt: '2024-01-20T14:30:00Z',
              updatedAt: '2024-01-20T14:30:00Z',
              notes: 'Commande test pour la démo'
            },
            {
              id: 'order-002',
              userId: 'client',
              userEmail: 'client@example.com', 
              userName: 'Client',
              items: [
                { id: 3, name: 'Burger Gourmand', price: 18.00, quantity: 1, image: 'burger-gourmand.jpg' }
              ],
              totalAmount: 18.00,
              status: 'delivered',
              paymentMethod: 'cash',
              isPaid: true,
              createdAt: '2024-01-19T12:15:00Z',
              updatedAt: '2024-01-19T13:45:00Z',
              notes: ''
            }
          ]
          
          set({ orders: initialOrders })
          localStorage.setItem('admin-orders', JSON.stringify(initialOrders))
        }
      },

      // Créer une nouvelle commande (appelé depuis le panier)
      createOrder: async (orderData) => {
        set({ isLoading: true })
        
        try {
          // Simulation d'appel API
          await new Promise(resolve => setTimeout(resolve, 800))
          
          const newOrder = {
            id: `order-${Date.now()}`,
            ...orderData,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
          
          const updatedOrders = [newOrder, ...get().orders]
          set({ orders: updatedOrders, isLoading: false })
          localStorage.setItem('admin-orders', JSON.stringify(updatedOrders))
          
          return { success: true, orderId: newOrder.id }
        } catch (error) {
          set({ isLoading: false })
          return { success: false, error: error.message }
        }
      },

      // Mettre à jour le statut d'une commande
      updateOrderStatus: async (orderId, newStatus) => {
        set({ isLoading: true })
        
        try {
          await new Promise(resolve => setTimeout(resolve, 500))
          
          const updatedOrders = get().orders.map(order =>
            order.id === orderId 
              ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
              : order
          )
          
          set({ orders: updatedOrders, isLoading: false })
          localStorage.setItem('admin-orders', JSON.stringify(updatedOrders))
          
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          return { success: false, error: error.message }
        }
      },

      // Getters
      getOrdersByStatus: (status) => {
        return get().orders.filter(order => order.status === status)
      },

      getOrdersByUser: (userId) => {
        return get().orders.filter(order => order.userId === userId)
      },

      getTodaysOrders: () => {
        const today = new Date().toISOString().split('T')[0]
        return get().orders.filter(order => 
          order.createdAt.startsWith(today)
        )
      },

      // Statistiques
      getOrdersStats: () => {
        const orders = get().orders
        return {
          total: orders.length,
          pending: orders.filter(o => o.status === 'pending').length,
          confirmed: orders.filter(o => o.status === 'confirmed').length,
          preparing: orders.filter(o => o.status === 'preparing').length,
          ready: orders.filter(o => o.status === 'ready').length,
          delivered: orders.filter(o => o.status === 'delivered').length,
          cancelled: orders.filter(o => o.status === 'cancelled').length,
          totalRevenue: orders
            .filter(o => ['delivered'].includes(o.status))
            .reduce((sum, order) => sum + order.totalAmount, 0)
        }
      }
    }),
    {
      name: 'orders-storage',
      partialize: (state) => ({ 
        orders: state.orders 
      }),
    }
  )
)

export default useOrdersStore