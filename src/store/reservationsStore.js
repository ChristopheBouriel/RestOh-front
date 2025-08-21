import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useReservationsStore = create(
  persist(
    (set, get) => ({
      // État
      reservations: [
        {
          id: 1,
          date: '2024-01-25',
          time: '19:30',
          people: 4,
          status: 'confirmed',
          requests: 'Table près de la fenêtre'
        },
        {
          id: 2,
          date: '2024-01-28',
          time: '20:00',
          people: 2,
          status: 'pending',
          requests: ''
        }
      ],

      // Actions
      addReservation: (reservationData) => {
        const newReservation = {
          id: Date.now(),
          ...reservationData,
          status: 'pending'
        }
        
        set({
          reservations: [...get().reservations, newReservation]
        })
        
        return newReservation
      },

      updateReservation: (reservationId, reservationData) => {
        set({
          reservations: get().reservations.map(reservation =>
            reservation.id === reservationId
              ? { ...reservation, ...reservationData }
              : reservation
          )
        })
      },

      deleteReservation: (reservationId) => {
        set({
          reservations: get().reservations.filter(r => r.id !== reservationId)
        })
      },

      getReservation: (reservationId) => {
        return get().reservations.find(r => r.id === reservationId)
      },

      // Utilitaires
      getReservationsByStatus: (status) => {
        return get().reservations.filter(r => r.status === status)
      },

      getUpcomingReservations: () => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        return get().reservations.filter(reservation => {
          const reservationDate = new Date(reservation.date)
          return reservationDate >= today && reservation.status !== 'cancelled'
        }).sort((a, b) => new Date(a.date) - new Date(b.date))
      }
    }),
    {
      name: 'reservations-storage',
      partialize: (state) => ({ 
        reservations: state.reservations 
      }),
    }
  )
)

export default useReservationsStore