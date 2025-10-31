// client/src/services/api.js
import axios from 'axios'
import userPool from '../cognito/userPool'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
})

api.interceptors.request.use(
	config => {
		return new Promise(resolve => {
			const cognitoUser = userPool.getCurrentUser()

			if (!cognitoUser) {
				console.log('Brak zalogowanego użytkownika')
				resolve(config)
				return
			}

			cognitoUser.getSession((err, session) => {
				if (!err && session?.isValid?.()) {
					const token = session.getIdToken().getJwtToken()
					config.headers.Authorization = `Bearer ${token}`
					console.log('✅ Token dodany do żądania')
				} else {
					console.log('⚠️ Sesja nie jest ważna')
				}
				resolve(config)
			})
		})
	},
	error => Promise.reject(error)
)

api.interceptors.response.use(
	response => response,
	error => {
		if (error.response?.status === 401) {
			console.warn('⚠️ Token wygasł, wylogowywanie')
			const cognitoUser = userPool.getCurrentUser()
			if (cognitoUser) {
				cognitoUser.signOut()
			}
			window.location.href = '/login'
		}
		return Promise.reject(error)
	}
)

export default api
