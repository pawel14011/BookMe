import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const ProtectedRoute = ({ component: Component }) => {
	const { isAuthenticated, loading } = useAuth()

	if (loading) {
		return (
			<div className='flex justify-center items-center h-screen'>
				<div className='text-xl text-gray-600'>Ładowanie...</div>
			</div>
		)
	}

	return isAuthenticated ? <Component /> : <Navigate to='/login' replace />
}

export default ProtectedRoute
