import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useUsersStore = create(
  persist(
    (set, get) => ({
      // État
      users: [],
      isLoading: false,

      // Actions
      setLoading: (loading) => set({ isLoading: loading }),

      // Initialiser avec des données de test
      initializeUsers: () => {
        const stored = localStorage.getItem('admin-users')
        if (stored) {
          set({ users: JSON.parse(stored) })
        } else {
          // Calculer des dates récentes
          const today = new Date()
          const oneWeekAgo = new Date(today)
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
          const twoWeeksAgo = new Date(today)
          twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)
          const oneMonthAgo = new Date(today)
          oneMonthAgo.setDate(oneMonthAgo.getDate() - 30)
          
          // Données initiales pour la démo
          const initialUsers = [
            {
              id: 'admin',
              email: 'admin@restoh.fr',
              name: 'Administrateur',
              role: 'admin',
              phone: '01 23 45 67 89',
              address: '456 Avenue de l\'Administration, 75008 Paris',
              isActive: true,
              emailVerified: true,
              createdAt: oneMonthAgo.toISOString(),
              lastLoginAt: today.toISOString(),
              totalOrders: 0,
              totalSpent: 0,
              totalReservations: 0
            },
            {
              id: 'client',
              email: 'client@example.com',
              name: 'Jean Dupont',
              role: 'user',
              phone: '06 12 34 56 78',
              address: '123 Rue de la République, 75001 Paris',
              isActive: true,
              emailVerified: true,
              createdAt: oneMonthAgo.toISOString(),
              lastLoginAt: today.toISOString(),
              totalOrders: 4,
              totalSpent: 105.80,
              totalReservations: 2
            },
            {
              id: 'user-001',
              email: 'marie.martin@email.fr',
              name: 'Marie Martin',
              role: 'user',
              phone: '07 98 76 54 32',
              address: '789 Boulevard Saint-Germain, 75007 Paris',
              isActive: true,
              emailVerified: true,
              createdAt: twoWeeksAgo.toISOString(),
              lastLoginAt: oneWeekAgo.toISOString(),
              totalOrders: 2,
              totalSpent: 45.30,
              totalReservations: 1
            },
            {
              id: 'user-002',
              email: 'paul.bernard@gmail.com',
              name: 'Paul Bernard',
              role: 'user',
              phone: '06 55 44 33 22',
              address: '321 Rue de Rivoli, 75004 Paris',
              isActive: true,
              emailVerified: false,
              createdAt: oneWeekAgo.toISOString(),
              lastLoginAt: null,
              totalOrders: 0,
              totalSpent: 0,
              totalReservations: 1
            },
            {
              id: 'user-003',
              email: 'sophie.durand@yahoo.fr',
              name: 'Sophie Durand',
              role: 'user',
              phone: '07 11 22 33 44',
              address: '654 Avenue des Champs-Élysées, 75008 Paris',
              isActive: false,
              emailVerified: true,
              createdAt: oneMonthAgo.toISOString(),
              lastLoginAt: twoWeeksAgo.toISOString(),
              totalOrders: 1,
              totalSpent: 28.50,
              totalReservations: 0
            }
          ]
          
          set({ users: initialUsers })
          localStorage.setItem('admin-users', JSON.stringify(initialUsers))
        }
      },

      // Créer un nouvel utilisateur (appelé depuis l'inscription)
      createUser: async (userData) => {
        set({ isLoading: true })
        
        try {
          // Simulation d'appel API
          await new Promise(resolve => setTimeout(resolve, 500))
          
          const newUser = {
            id: `user-${Date.now()}`,
            ...userData,
            role: 'user',
            isActive: true,
            emailVerified: false,
            createdAt: new Date().toISOString(),
            lastLoginAt: null,
            totalOrders: 0,
            totalSpent: 0,
            totalReservations: 0
          }
          
          const updatedUsers = [newUser, ...get().users]
          set({ users: updatedUsers, isLoading: false })
          localStorage.setItem('admin-users', JSON.stringify(updatedUsers))
          
          return { success: true, userId: newUser.id }
        } catch (error) {
          set({ isLoading: false })
          return { success: false, error: error.message }
        }
      },

      // Mettre à jour le profil d'un utilisateur
      updateUser: async (userId, userData) => {
        set({ isLoading: true })
        
        try {
          await new Promise(resolve => setTimeout(resolve, 500))
          
          const updatedUsers = get().users.map(user =>
            user.id === userId 
              ? { ...user, ...userData, updatedAt: new Date().toISOString() }
              : user
          )
          
          set({ users: updatedUsers, isLoading: false })
          localStorage.setItem('admin-users', JSON.stringify(updatedUsers))
          
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          return { success: false, error: error.message }
        }
      },

      // Activer/désactiver un utilisateur
      toggleUserStatus: async (userId) => {
        set({ isLoading: true })
        
        try {
          await new Promise(resolve => setTimeout(resolve, 500))
          
          const updatedUsers = get().users.map(user =>
            user.id === userId 
              ? { ...user, isActive: !user.isActive, updatedAt: new Date().toISOString() }
              : user
          )
          
          set({ users: updatedUsers, isLoading: false })
          localStorage.setItem('admin-users', JSON.stringify(updatedUsers))
          
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          return { success: false, error: error.message }
        }
      },

      // Changer le rôle d'un utilisateur
      updateUserRole: async (userId, newRole) => {
        set({ isLoading: true })
        
        try {
          await new Promise(resolve => setTimeout(resolve, 500))
          
          const updatedUsers = get().users.map(user =>
            user.id === userId 
              ? { ...user, role: newRole, updatedAt: new Date().toISOString() }
              : user
          )
          
          set({ users: updatedUsers, isLoading: false })
          localStorage.setItem('admin-users', JSON.stringify(updatedUsers))
          
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          return { success: false, error: error.message }
        }
      },

      // Mettre à jour la dernière connexion
      updateLastLogin: (userId) => {
        const updatedUsers = get().users.map(user =>
          user.id === userId 
            ? { ...user, lastLoginAt: new Date().toISOString() }
            : user
        )
        
        set({ users: updatedUsers })
        localStorage.setItem('admin-users', JSON.stringify(updatedUsers))
      },

      // Mettre à jour les statistiques d'activité
      updateUserStats: (userId, stats) => {
        const updatedUsers = get().users.map(user =>
          user.id === userId 
            ? { ...user, ...stats }
            : user
        )
        
        set({ users: updatedUsers })
        localStorage.setItem('admin-users', JSON.stringify(updatedUsers))
      },

      // Getters
      getUserById: (userId) => {
        return get().users.find(user => user.id === userId)
      },

      getUsersByRole: (role) => {
        return get().users.filter(user => user.role === role)
      },

      getActiveUsers: () => {
        return get().users.filter(user => user.isActive)
      },

      getInactiveUsers: () => {
        return get().users.filter(user => !user.isActive)
      },

      getUnverifiedUsers: () => {
        return get().users.filter(user => !user.emailVerified)
      },

      searchUsers: (query) => {
        const lowercaseQuery = query.toLowerCase()
        return get().users.filter(user => 
          user.name.toLowerCase().includes(lowercaseQuery) ||
          user.email.toLowerCase().includes(lowercaseQuery) ||
          user.phone?.includes(query)
        )
      },

      // Statistiques
      getUsersStats: () => {
        const users = get().users
        const activeUsers = users.filter(u => u.isActive)
        const today = new Date()
        const thirtyDaysAgo = new Date(today)
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        
        const newUsersThisMonth = users.filter(u => {
          const createdDate = new Date(u.createdAt)
          return createdDate >= thirtyDaysAgo
        })

        const activeThisMonth = users.filter(u => {
          if (!u.lastLoginAt) return false
          const lastLogin = new Date(u.lastLoginAt)
          return lastLogin >= thirtyDaysAgo
        })
        
        return {
          total: users.length,
          active: activeUsers.length,
          inactive: users.length - activeUsers.length,
          admins: users.filter(u => u.role === 'admin').length,
          regularUsers: users.filter(u => u.role === 'user').length,
          verified: users.filter(u => u.emailVerified).length,
          unverified: users.filter(u => !u.emailVerified).length,
          newThisMonth: newUsersThisMonth.length,
          activeThisMonth: activeThisMonth.length,
          totalRevenue: users.reduce((sum, user) => sum + (user.totalSpent || 0), 0),
          totalOrders: users.reduce((sum, user) => sum + (user.totalOrders || 0), 0),
          totalReservations: users.reduce((sum, user) => sum + (user.totalReservations || 0), 0)
        }
      }
    }),
    {
      name: 'users-storage',
      partialize: (state) => ({ 
        users: state.users 
      }),
    }
  )
)

export default useUsersStore