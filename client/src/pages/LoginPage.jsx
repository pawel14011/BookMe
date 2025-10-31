import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import LoginForm from '../components/LoginForm'
import RegisterForm from '../components/RegisterForm'

const LoginPage = () => {
	const [isLogin, setIsLogin] = useState(true)
	const { isAuthenticated } = useAuth()

	if (isAuthenticated) {
		return <Navigate to='/dashboard' replace />
	}

	return (
		<div className='min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4'>
			<div className='w-full max-w-md'>
				{isLogin ? (
					<LoginForm onSwitchToRegister={() => setIsLogin(false)} />
				) : (
					<RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
				)}
			</div>
		</div>
	)
}

export default LoginPage
