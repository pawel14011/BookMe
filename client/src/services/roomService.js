import api from './api'

export const roomService = {
	// Typy sal
	getAllRoomTypes: async () => {
		const response = await api.get('/rooms/types')
		return response.data
	},

	createRoomType: async data => {
		const response = await api.post('/rooms/types', data)
		return response.data
	},

	deleteRoomType: async id => {
		const response = await api.delete(`/rooms/types/${id}`)
		return response.data
	},

	// Sale
	getAllRooms: async () => {
		const response = await api.get('/rooms')
		return response.data
	},

	getAvailableRooms: async (roomTypeId = null) => {
		const params = roomTypeId ? { roomTypeId } : {}
		const response = await api.get('/rooms/available', { params })
		return response.data
	},

	getRoomById: async id => {
		const response = await api.get(`/rooms/${id}`)
		return response.data
	},

	createRoom: async data => {
		const response = await api.post('/rooms', data)
		return response.data
	},

	updateRoom: async (id, data) => {
		const response = await api.put(`/rooms/${id}`, data)
		return response.data
	},

	deleteRoom: async id => {
		const response = await api.delete(`/rooms/${id}`)
		return response.data
	},
}
