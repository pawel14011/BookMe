import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { authService } from '../services/authService'

const LoginForm = ({ onSwitchToRegister }) => {
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	})
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	const navigate = useNavigate()
	const { login } = useAuth()

	const handleChange = e => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		})
		setError('')
	}

	const handleSubmit = async e => {
		e.preventDefault()
		setLoading(true)
		setError('')

		try {
			// ✅ Wywołaj login z kontekstu (authService.login jest wewnątrz)
			await login(formData.email, formData.password)
			navigate('/dashboard')
		} catch (err) {
			// ✅ Obsłuż błędy z Cognito
			if (err.code === 'UserNotConfirmedException') {
				setError('Twoje konto nie zostało potwierdzone. Sprawdź email.')
			} else if (err.code === 'NotAuthorizedException') {
				setError('Nieprawidłowe hasło lub email')
			} else if (err.code === 'UserNotFoundException') {
				setError('Użytkownik nie znaleziony')
			} else {
				setError(err.message || 'Błąd podczas logowania')
			}
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="w-full max-w-md">
			<div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
				<h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Logowanie</h2>

				{error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
							Email
						</label>
						<input
							type="email"
							id="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="twoj@email.com"
							required
						/>
					</div>

					<div className="mb-6">
						<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
							Hasło
						</label>
						<input
							type="password"
							id="password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="••••••••"
							required
						/>
					</div>

					<div className="flex items-center justify-between">
						<button
							type="submit"
							disabled={loading}
							className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 w-full">
							{loading ? 'Logowanie...' : 'Zaloguj się'}
						</button>
					</div>
				</form>

				<div className="text-center mt-6">
					<p className="text-gray-600">
						Nie masz konta?{' '}
						<button onClick={onSwitchToRegister} className="text-blue-500 hover:text-blue-700 font-semibold">
							Zarejestruj się
						</button>
					</p>
				</div>
			</div>
		</div>
	)
}

export default LoginForm
