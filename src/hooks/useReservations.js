import { toast } from 'react-hot-toast'
import useReservationsStore from '../store/reservationsStore'

export const useReservations = () => {
  const {
    reservations,
    addReservation,
    updateReservation,
    deleteReservation,
    getReservation,
    getReservationsByStatus,
    getUpcomingReservations
  } = useReservationsStore()

  const handleCreateReservation = (reservationData) => {
    try {
      const newReservation = addReservation(reservationData)
      toast.success('Réservation créée avec succès !')
      return newReservation
    } catch (error) {
      toast.error('Erreur lors de la création de la réservation')
      throw error
    }
  }

  const handleUpdateReservation = (reservationId, reservationData) => {
    try {
      updateReservation(reservationId, reservationData)
      toast.success('Réservation modifiée avec succès !')
    } catch (error) {
      toast.error('Erreur lors de la modification de la réservation')
      throw error
    }
  }

  const handleCancelReservation = (reservationId) => {
    try {
      deleteReservation(reservationId)
      toast.success('Réservation annulée')
    } catch (error) {
      toast.error('Erreur lors de l\'annulation de la réservation')
      throw error
    }
  }

  const handleConfirmCancellation = (reservationId) => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      handleCancelReservation(reservationId)
      return true
    }
    return false
  }

  // Formatage des dates
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR')
  }

  const formatDateTime = (date, time) => {
    return `${formatDate(date)} à ${time}`
  }

  // Validation
  const validateReservationData = (data) => {
    const errors = []
    
    if (!data.date) {
      errors.push('La date est obligatoire')
    }
    
    if (!data.time) {
      errors.push('L\'heure est obligatoire')
    }
    
    if (!data.people || data.people < 1) {
      errors.push('Le nombre de personnes doit être au moins 1')
    }
    
    // Vérifier que la date n'est pas dans le passé
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const reservationDate = new Date(data.date)
    
    if (reservationDate < today) {
      errors.push('Impossible de réserver dans le passé')
    }
    
    return errors
  }

  return {
    // État
    reservations,
    upcomingReservations: getUpcomingReservations(),
    
    // Actions avec gestion d'erreurs
    createReservation: handleCreateReservation,
    updateReservation: handleUpdateReservation,
    cancelReservation: handleConfirmCancellation,
    
    // Utilitaires
    getReservation,
    getReservationsByStatus,
    formatDate,
    formatDateTime,
    validateReservationData,
    
    // Statistiques
    totalReservations: reservations.length,
    confirmedReservations: getReservationsByStatus('confirmed').length,
    pendingReservations: getReservationsByStatus('pending').length
  }
}