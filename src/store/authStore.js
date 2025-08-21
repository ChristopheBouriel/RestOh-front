import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set, get) => ({
      // État
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      setToken: (token) => set({ token }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error }),
      
      clearError: () => set({ error: null }),

      login: async (credentials) => {
        set({ isLoading: true, error: null })
        
        try {
          // TODO: Remplacer par l'appel API réel
          console.log('Login attempt:', credentials)
          
          // Simulation d'appel API
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // Simuler la récupération des données utilisateur depuis une "base de données"
          // En réalité, cela viendrait de l'API backend
          const storedUsers = JSON.parse(localStorage.getItem('registered-users') || '[]')
          const existingUser = storedUsers.find(user => user.email === credentials.email)
          
          let mockUser
          if (existingUser) {
            // Utiliser les données de l'utilisateur enregistré
            mockUser = {
              id: existingUser.id,
              email: existingUser.email,
              name: existingUser.name,
              role: existingUser.role || 'user'
            }
          } else {
            // Utilisateur de test par défaut
            mockUser = {
              id: 1,
              email: credentials.email,
              name: credentials.email === 'admin@restoh.fr' ? 'Administrateur' : 'Utilisateur',
              role: credentials.email === 'admin@restoh.fr' ? 'admin' : 'user'
            }
          }
          
          const mockToken = 'mock-jwt-token-' + Date.now()
          
          set({
            user: mockUser,
            token: mockToken,
            isAuthenticated: true,
            isLoading: false,
            error: null
          })
          
          return { success: true }
        } catch (error) {
          set({
            error: error.message || 'Erreur de connexion',
            isLoading: false
          })
          return { success: false, error: error.message }
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null })
        
        try {
          // TODO: Remplacer par l'appel API réel
          console.log('Register attempt:', userData)
          
          // Simulation d'appel API
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          const newUser = {
            id: Date.now(),
            email: userData.email,
            name: userData.name,
            role: 'user'
          }
          
          // Sauvegarder l'utilisateur dans le localStorage pour simulation
          const storedUsers = JSON.parse(localStorage.getItem('registered-users') || '[]')
          storedUsers.push(newUser)
          localStorage.setItem('registered-users', JSON.stringify(storedUsers))
          
          const mockToken = 'mock-jwt-token-' + Date.now()
          
          set({
            user: newUser,
            token: mockToken,
            isAuthenticated: true,
            isLoading: false,
            error: null
          })
          
          return { success: true }
        } catch (error) {
          set({
            error: error.message || 'Erreur lors de l\'inscription',
            isLoading: false
          })
          return { success: false, error: error.message }
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null
        })
      },

      updateProfile: async (profileData) => {
        set({ isLoading: true, error: null })
        
        try {
          // TODO: Remplacer par l'appel API réel
          console.log('Update profile:', profileData)
          
          // Simulation d'appel API
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          const currentUser = get().user
          const updatedUser = { ...currentUser, ...profileData }
          
          set({
            user: updatedUser,
            isLoading: false,
            error: null
          })
          
          return { success: true }
        } catch (error) {
          set({
            error: error.message || 'Erreur lors de la mise à jour',
            isLoading: false
          })
          return { success: false, error: error.message }
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
)

export default useAuthStore