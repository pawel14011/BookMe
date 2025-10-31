import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import { useAuth } from '../hooks/useAuth'

const RegisterForm = ({ onSwitchToLogin }) => {
	const [step, setStep] = useState('register')
	const [formData, setFormData] = useState({
		email: '',
		password: '',
		confirmPassword: '',
		firstName: '',
		lastName: '',
		title: '',
		subjects: '',
	})
	const [verificationCode, setVerificationCode] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	const navigate = useNavigate()

	const { register, confirmRegistration } = useAuth()

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

		// Walidacja hasła
		if (formData.password !== formData.confirmPassword) {
			setError('Hasła nie są identyczne')
			setLoading(false)
			return
		}

		if (formData.password.length < 8) {
			setError('Hasło musi mieć minimum 8 znaków')
			setLoading(false)
			return
		}

		try {
			const { confirmPassword, ...dataToSend } = formData
			await register(dataToSend)
			setStep('confirm')
			alert('Rejestracja wysłana! Sprawdź swój email po kod weryfikacyjny.')
		} catch (err) {
			// ✅ Obsłuż błędy z Cognito
			if (err.code === 'UsernameExistsException') {
				setError('Ten email już istnieje')
			} else if (err.code === 'InvalidPasswordException') {
				setError('Hasło nie spełnia wymagań')
			} else {
				setError(err.message || 'Błąd podczas rejestracji')
			}
		} finally {
			setLoading(false)
		}
	}

	const handleVerification = async e => {
		e.preventDefault()
		setLoading(true)
		setError('')

		if (!verificationCode) {
			setError('Wpisz kod weryfikacyjny')
			setLoading(false)
			return
		}

		try {
			await confirmRegistration(formData.email, verificationCode)
			alert('Rejestracja potwierdzona! Możesz się teraz zalogować.')
			onSwitchToLogin()
		} catch (err) {
			if (err.code === 'ExpiredCodeException') {
				setError('Kod wygasł. Poproś o nowy kod.')
			} else if (err.code === 'CodeMismatchException') {
				setError('Nieprawidłowy kod')
			} else {
				setError(err.message || 'Błąd podczas potwierdzenia')
			}
		} finally {
			setLoading(false)
		}
	}

	if (step === 'confirm') {
		return (
			<div className="w-full max-w-md">
				<div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
					<h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Potwierdź rejestrację</h2>

					{error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

					<p className="text-gray-600 text-center mb-4">
						Wysłaliśmy kod weryfikacyjny na adres: <strong>{formData.email}</strong>
					</p>

					<form onSubmit={handleVerification}>
						<div className="mb-4">
							<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="verificationCode">
								Kod weryfikacyjny
							</label>
							<input
								type="text"
								id="verificationCode"
								value={verificationCode}
								onChange={e => setVerificationCode(e.target.value)}
								className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="123456"
								required
								disabled={loading}
							/>
						</div>

						<button
							type="submit"
							disabled={loading}
							className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 w-full">
							{loading ? 'Weryfikacja...' : 'Potwierdź'}
						</button>
					</form>

					<div className="text-center mt-6">
						<button
							onClick={() => setStep('register')}
							className="text-blue-500 hover:text-blue-700 font-semibold text-sm"
							type="button">
							← Wróć do rejestracji
						</button>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="w-full max-w-md">
			<div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
				<h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Rejestracja</h2>

				{error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

				<form onSubmit={handleSubmit}>
					{/* Email - wymagany */}
					<div className="mb-4">
						<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
							Email <span className="text-red-500">*</span>
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

					{/* Hasło - wymagane */}
					<div className="mb-4">
						<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
							Hasło <span className="text-red-500">*</span>
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
							minLength={6}
						/>
					</div>

					{/* Potwierdzenie hasła */}
					<div className="mb-4">
						<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
							Potwierdź hasło <span className="text-red-500">*</span>
						</label>
						<input
							type="password"
							id="confirmPassword"
							name="confirmPassword"
							value={formData.confirmPassword}
							onChange={handleChange}
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="••••••••"
							required
						/>
					</div>

					{/* Pola opcjonalne */}
					<div className="border-t pt-4 mb-4">
						<p className="text-sm text-gray-600 mb-3">Pola opcjonalne:</p>

						<div className="mb-3">
							<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
								Imię
							</label>
							<input
								type="text"
								id="firstName"
								name="firstName"
								value={formData.firstName}
								onChange={handleChange}
								className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Jan"
							/>
						</div>

						<div className="mb-3">
							<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
								Nazwisko
							</label>
							<input
								type="text"
								id="lastName"
								name="lastName"
								value={formData.lastName}
								onChange={handleChange}
								className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Kowalski"
							/>
						</div>

						<div className="mb-3">
							<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
								Tytuł naukowy
							</label>
							<input
								type="text"
								id="title"
								name="title"
								value={formData.title}
								onChange={handleChange}
								className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Dr, Prof. dr hab., itp."
							/>
						</div>

						<div className="mb-3">
							<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subjects">
								Prowadzone przedmioty
							</label>
							<textarea
								id="subjects"
								name="subjects"
								value={formData.subjects}
								onChange={handleChange}
								className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Matematyka, Fizyka, Informatyka"
								rows="3"
							/>
						</div>
					</div>

					<div className="flex items-center justify-between">
						<button
							type="submit"
							disabled={loading}
							className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 w-full">
							{loading ? 'Rejestracja...' : 'Zarejestruj'}
						</button>
					</div>
				</form>

				<div className="text-center mt-6">
					<p className="text-gray-600">
						Masz już konto?{' '}
						<button onClick={onSwitchToLogin} className="text-blue-500 hover:text-blue-700 font-semibold">
							Zaloguj się
						</button>
					</p>
				</div>
			</div>
		</div>
	)
}

export default RegisterForm
