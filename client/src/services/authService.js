import api from './api'

export const authService = {
	// Rejestracja
	register: async userData => {
		const response = await api.post('/auth/register', userData)
		return response.data
	},

	// Logowanie
	login: async credentials => {
		const response = await api.post('/auth/login', credentials)
		return response.data
	},

	// Pobranie profilu
	getProfile: async () => {
		const response = await api.get('/auth/profile')
		return response.data
	},

	// Aktualizacja profilu
	updateProfile: async userData => {
		const response = await api.put('/auth/profile', userData)
		return response.data
	},

	// Usunięcie konta
	deleteAccount: async () => {
		const response = await api.delete('/auth/account')
		return response.data
	},
}
