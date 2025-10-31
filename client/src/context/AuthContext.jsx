import React, { createContext, useState, useEffect } from 'react'
import { storage } from '../utils/storage'
import { authService } from '../services/authService'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null)
	const [token, setToken] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		const loadUser = async () => {
			try {
				const currentUser = await authService.getCurrentUser()
				if (currentUser) {
					setUser(currentUser)
					setToken(currentUser.token)
				}
			} catch (err) {
				console.error('Błąd ładowania użytkownika:', err)
				setError(err.message)
			} finally {
				setLoading(false)
			}
		}

		loadUser()
	}, [])

	const login = async (email, password) => {
		try {
			setError(null)
			const response = await authService.login(email, password)
			setUser(response.user)
			setToken(response.token)
			return response
		} catch (err) {
			setError(err.message)
			throw err
		}
	}

	const register = async userData => {
		try {
			setError(null)
			const response = await authService.register(userData)
			return response
		} catch (err) {
			setError(err.message)
			throw err
		}
	}

	const confirmRegistration = async (email, code) => {
		try {
			setError(null)
			const response = await authService.confirmRegistration(email, code)
			return response
		} catch (err) {
			setError(err.message)
			throw err
		}
	}

	const logout = () => {
		try {
			authService.logout()
			setUser(null)
			setToken(null)
			setError(null)
		} catch (err) {
			console.error('Błąd podczas wylogowania:', err)
		}
	}

	const updateProfile = async updatedData => {
		if (!user) throw new Error('Użytkownik nie zalogowany')

		try {
			setError(null)
			console.log('AuthContext - wysyłam dane:', updatedData)

			const updated = await authService.updateProfile(updatedData)

			console.log('AuthContext - otrzymane dane:', updated)
			setUser(updated)

			return updated
		} catch (err) {
			console.error('AuthContext - błąd:', err)
			setError(err.message)
			throw err
		}
	}

	const deleteAccount = async () => {
		if (!user) throw new Error('Użytkownik nie zalogowany')

		try {
			setError(null)
			await authService.deleteAccount(user.email)
			setUser(null)
			setToken(null)
		} catch (err) {
			setError(err.message)
			throw err
		}
	}

	return (
		<AuthContext.Provider
			value={{
				user,
				token,
				loading,
				error,
				login,
				logout,
				register,
				confirmRegistration,
				updateProfile,
				deleteAccount,
				isAuthenticated: !!token,
				isAdmin: user?.role === 'admin',
			}}>
			{children}
		</AuthContext.Provider>
	)
}
