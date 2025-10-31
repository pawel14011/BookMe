import api from './api'
import userPool from '../cognito/userPool'
import { CognitoUserAttribute, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js'

export const authService = {
	// Rejestracja
	register: async userData => {
		const { email, password, firstName, lastName, title, subjects } = userData

		const attributeList = []
		attributeList.push(new CognitoUserAttribute({ Name: 'email', Value: email }))

		if (firstName) {
			attributeList.push(new CognitoUserAttribute({ Name: 'given_name', Value: firstName }))
		}
		if (lastName) {
			attributeList.push(new CognitoUserAttribute({ Name: 'family_name', Value: lastName }))
		}

		// Rejestracja w Cognito
		return new Promise((resolve, reject) => {
			userPool.signUp(email, password, attributeList, null, async (err, result) => {
				if (err) {
					reject(err)
					return
				}

				try {
					// ✅ TERAZ wysyłamy do backendu dane użytkownika
					const response = await api.post('/auth/register', {
						cognitoUserId: result.userSub,
						email,
						firstName,
						lastName,
						title,
						subjects,
					})

					resolve({
						user: response.data,
						userConfirmed: result.userConfirmed,
						userSub: result.userSub,
					})
				} catch (apiError) {
					// Jeśli backend się nie powiedzie, usuń użytkownika z Cognito
					const cognitoUser = new CognitoUser({
						Username: email,
						Pool: userPool,
					})
					cognitoUser.deleteUser(() => {})
					reject(apiError)
				}
			})
		})
	},

	// ===== POTWIERDZENIE REJESTRACJI =====
	confirmRegistration: async (email, code) => {
		const cognitoUser = new CognitoUser({
			Username: email,
			Pool: userPool,
		})

		return new Promise((resolve, reject) => {
			cognitoUser.confirmRegistration(code, true, async (err, result) => {
				if (err) {
					reject(err)
					return
				}

				try {
					// ✅ Powiadom backend o weryfikacji
					await api.post('/auth/confirm-email', { email })
					resolve(result)
				} catch (apiError) {
					reject(apiError)
				}
			})
		})
	},

	// Logowanie
	login: async (email, password) => {
		const authenticationDetails = new AuthenticationDetails({
			Username: email,
			Password: password,
		})

		const cognitoUser = new CognitoUser({
			Username: email,
			Pool: userPool,
		})

		return new Promise((resolve, reject) => {
			cognitoUser.authenticateUser(authenticationDetails, {
				onSuccess: async session => {
					const idToken = session.getIdToken().getJwtToken()
					const accessToken = session.getAccessToken().getJwtToken()

					try {
						// ✅ Pobierz dane użytkownika z backendu
						const response = await api.get('/auth/profile', {
							headers: { Authorization: `Bearer ${idToken}` },
						})

						const userData = response.data.user || response.data

						resolve({
							user: userData,
							token: idToken,
							accessToken,
						})
					} catch (apiError) {
						reject(apiError)
					}
				},
				onFailure: err => {
					reject(err)
				},
			})
		})
	},

	// ===== WYLOGOWANIE =====
	logout: () => {
		const cognitoUser = userPool.getCurrentUser()
		if (cognitoUser) {
			cognitoUser.signOut()
		}
	},

	// ===== POBRANIE OBECNEGO UŻYTKOWNIKA =====
	getCurrentUser: async () => {
		const cognitoUser = userPool.getCurrentUser()

		if (!cognitoUser) {
			return null
		}

		return new Promise((resolve, reject) => {
			cognitoUser.getSession(async (err, session) => {
				if (err) {
					reject(err)
					return
				}

				if (!session.isValid()) {
					resolve(null)
					return
				}

				try {
					const idToken = session.getIdToken().getJwtToken()

					// ✅ Pobierz dane z backendu
					const response = await api.get('/auth/profile', {
						headers: { Authorization: `Bearer ${idToken}` },
					})

					const userData = response.data.user || response.data

					resolve({
						...userData,
						token: idToken,
					})
				} catch (apiError) {
					reject(apiError)
				}
			})
		})
	},

	// Pobranie profilu
	getProfile: async () => {
		try {
			const headers = await getAuthHeader()
			const response = await api.get('/auth/profile', { headers })
			return response.data.user || response.data
		} catch (error) {
			console.error('Błąd pobierania profilu:', error)
			throw error
		}
	},

	// Aktualizacja profilu
	updateProfile: async userData => {
		try {
			console.log('authService.updateProfile - Input:', userData)

			const response = await api.put('/auth/profile', userData)

			console.log('authService.updateProfile - Response:', response.data)

			// Backend zwraca { user: { ... } }
			return response.data.user || response.data
		} catch (error) {
			console.error('authService.updateProfile - Error:', error)

			if (error.response) {
				console.error('Status:', error.response.status)
				console.error('Data:', error.response.data)
			}

			throw error
		}
	},

	// Usunięcie konta
	deleteAccount: async () => {
		const cognitoUser = userPool.getCurrentUser()

		if (!cognitoUser) {
			throw new Error('Użytkownik nie zalogowany')
		}

		return new Promise((resolve, reject) => {
			cognitoUser.getSession((err, session) => {
				if (err) {
					console.error('Błąd pobierania sesji:', err)
					reject(new Error('Nie można pobrać sesji użytkownika'))
					return
				}

				if (!session.isValid()) {
					reject(new Error('Sesja wygasła'))
					return
				}

				api
					.delete('/auth/account')
					.then(() => {
						cognitoUser.deleteUser(err => {
							if (err) {
								console.error('Błąd usuwania z Cognito:', err)
								cognitoUser.signOut()
								resolve({
									message: 'Konto usunięte z bazy, ale nie z Cognito (spróbuj ponownie)',
								})
								return
							}

							cognitoUser.signOut()
							resolve({ message: 'Konto usunięte' })
						})
					})
					.catch(error => {
						console.error('Błąd usuwania konta z backendu:', error)
						reject(new Error('Błąd usuwania konta: ' + error.message))
					})
			})
		})
	},
}

const getAuthHeader = async () => {
	const cognitoUser = userPool.getCurrentUser()

	if (!cognitoUser) {
		return {}
	}

	return new Promise(resolve => {
		cognitoUser.getSession((err, session) => {
			if (err || !session?.isValid?.()) {
				resolve({})
				return
			}

			const token = session.getIdToken().getJwtToken()
			resolve({ Authorization: `Bearer ${token}` })
		})
	})
}
