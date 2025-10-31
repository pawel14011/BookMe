import api from './api'

export const bookingService = {
	// Pobieranie rezerwacji
	getMyBookings: async () => {
		const response = await api.get('/bookings/my-bookings')
		return response.data
	},

	getAllBookings: async () => {
		const response = await api.get('/bookings')
		return response.data
	},

	getRoomBookings: async (roomId, startDate, endDate) => {
		const response = await api.get('/bookings/room/:roomId', {
			params: { roomId, startDate, endDate },
		})
		return response.data
	},

	// Sprawdzanie dostępności
	checkAvailability: async data => {
		const response = await api.post('/bookings/check-availability', data)
		return response.data
	},

	// CRUD rezerwacji
	createBooking: async data => {
		const response = await api.post('/bookings', data)
		return response.data
	},

	updateBooking: async (id, data) => {
		const response = await api.put(`/bookings/${id}`, data)
		return response.data
	},

	cancelBooking: async id => {
		const response = await api.patch(`/bookings/${id}/cancel`)
		return response.data
	},

	deleteBooking: async id => {
		const response = await api.delete(`/bookings/${id}`)
		return response.data
	},
}
