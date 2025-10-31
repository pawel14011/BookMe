import React, { createContext, useState, useEffect } from 'react'
import { storage } from '../utils/storage'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null)
	const [token, setToken] = useState(null)
	const [loading, setLoading] = useState(true)

	// Załaduj dane z localStorage na starcie
	useEffect(() => {
		const savedToken = storage.getToken()
		const savedUser = storage.getUser()

		if (savedToken && savedUser) {
			setToken(savedToken)
			setUser(savedUser)
		}

		setLoading(false)
	}, [])

	const login = (userData, tokenData) => {
		setUser(userData)
		setToken(tokenData)
		storage.setToken(tokenData)
		storage.setUser(userData)
	}

	const logout = () => {
		setUser(null)
		setToken(null)
		storage.clear()
	}

	const updateUser = updatedData => {
		const newUser = { ...user, ...updatedData }
		setUser(newUser)
		storage.setUser(newUser)
	}

	return (
		<AuthContext.Provider
			value={{
				user,
				token,
				loading,
				login,
				logout,
				updateUser,
				isAuthenticated: !!token,
				isAdmin: user?.role === 'admin',
			}}>
			{children}
		</AuthContext.Provider>
	)
}
