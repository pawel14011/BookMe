import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { authService } from '../services/authService'

const ProfilePage = () => {
	const { user, updateUser } = useAuth()
	const [isEditing, setIsEditing] = useState(false)
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		title: '',
		subjects: '',
	})
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')

	useEffect(() => {
		if (user) {
			setFormData({
				firstName: user.firstName || '',
				lastName: user.lastName || '',
				title: user.title || '',
				subjects: user.subjects || '',
			})
		}
	}, [user])

	const handleChange = e => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		})
		setError('')
		setSuccess('')
	}

	const handleSubmit = async e => {
		e.preventDefault()
		setLoading(true)
		setError('')
		setSuccess('')

		try {
			const response = await authService.updateProfile(formData)
			updateUser(response.user)
			setSuccess('Profil zaktualizowany pomyślnie!')
			setIsEditing(false)
		} catch (err) {
			setError(err.response?.data?.message || 'Błąd podczas aktualizacji profilu')
		} finally {
			setLoading(false)
		}
	}

	const handleDeleteAccount = async () => {
		if (!window.confirm('Czy na pewno chcesz usunąć swoje konto? Ta operacja jest nieodwracalna!')) {
			return
		}

		if (
			!window.confirm('To jest ostatnie ostrzeżenie! Wszystkie Twoje dane i rezerwacje zostaną usunięte. Kontynuować?')
		) {
			return
		}

		try {
			await authService.deleteAccount()
			alert('Konto zostało usunięte. Zostaniesz wylogowany.')
			window.location.href = '/login'
		} catch (err) {
			alert('Błąd podczas usuwania konta')
		}
	}

	return (
		<div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
			<h1 className='text-3xl font-bold mb-6'>Mój Profil</h1>

			{error && <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>{error}</div>}

			{success && (
				<div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4'>{success}</div>
			)}

			<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
				{/* Karta informacji podstawowych */}
				<div className='md:col-span-2 bg-white rounded-lg shadow p-6'>
					<div className='flex justify-between items-center mb-6'>
						<h2 className='text-xl font-bold'>Informacje podstawowe</h2>
						{!isEditing && (
							<button
								onClick={() => setIsEditing(true)}
								className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
								Edytuj
							</button>
						)}
					</div>

					{isEditing ? (
						<form onSubmit={handleSubmit}>
							<div className='space-y-4'>
								<div>
									<label className='block text-gray-700 text-sm font-bold mb-2'>Email (nie można zmienić)</label>
									<input
										type='email'
										value={user?.email}
										disabled
										className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-100 cursor-not-allowed'
									/>
								</div>

								<div>
									<label className='block text-gray-700 text-sm font-bold mb-2'>Imię</label>
									<input
										type='text'
										name='firstName'
										value={formData.firstName}
										onChange={handleChange}
										className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500'
										placeholder='Jan'
									/>
								</div>

								<div>
									<label className='block text-gray-700 text-sm font-bold mb-2'>Nazwisko</label>
									<input
										type='text'
										name='lastName'
										value={formData.lastName}
										onChange={handleChange}
										className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500'
										placeholder='Kowalski'
									/>
								</div>

								<div>
									<label className='block text-gray-700 text-sm font-bold mb-2'>Tytuł naukowy</label>
									<input
										type='text'
										name='title'
										value={formData.title}
										onChange={handleChange}
										className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500'
										placeholder='Dr, Prof. dr hab., itp.'
									/>
								</div>

								<div>
									<label className='block text-gray-700 text-sm font-bold mb-2'>Prowadzone przedmioty</label>
									<textarea
										name='subjects'
										value={formData.subjects}
										onChange={handleChange}
										className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500'
										rows='3'
										placeholder='Matematyka, Fizyka, Informatyka'
									/>
								</div>

								<div className='flex gap-2'>
									<button
										type='submit'
										disabled={loading}
										className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50'>
										{loading ? 'Zapisywanie...' : 'Zapisz zmiany'}
									</button>
									<button
										type='button'
										onClick={() => {
											setIsEditing(false)
											setFormData({
												firstName: user.firstName || '',
												lastName: user.lastName || '',
												title: user.title || '',
												subjects: user.subjects || '',
											})
										}}
										className='bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded'>
										Anuluj
									</button>
								</div>
							</div>
						</form>
					) : (
						<div className='space-y-4'>
							<div>
								<label className='block text-sm font-semibold text-gray-600'>Email</label>
								<p className='text-gray-800'>{user?.email}</p>
							</div>

							<div>
								<label className='block text-sm font-semibold text-gray-600'>Imię</label>
								<p className='text-gray-800'>{user?.firstName || '-'}</p>
							</div>

							<div>
								<label className='block text-sm font-semibold text-gray-600'>Nazwisko</label>
								<p className='text-gray-800'>{user?.lastName || '-'}</p>
							</div>

							<div>
								<label className='block text-sm font-semibold text-gray-600'>Tytuł naukowy</label>
								<p className='text-gray-800'>{user?.title || '-'}</p>
							</div>

							<div>
								<label className='block text-sm font-semibold text-gray-600'>Prowadzone przedmioty</label>
								<p className='text-gray-800'>{user?.subjects || '-'}</p>
							</div>

							<div>
								<label className='block text-sm font-semibold text-gray-600'>Rola</label>
								<p className='text-gray-800'>
									{user?.role === 'admin' ? (
										<span className='bg-purple-100 text-purple-800 px-2 py-1 rounded'>Administrator</span>
									) : (
										<span className='bg-blue-100 text-blue-800 px-2 py-1 rounded'>Użytkownik</span>
									)}
								</p>
							</div>
						</div>
					)}
				</div>

				{/* Karta statystyk i akcji */}
				<div className='space-y-6'>
					{/* Karta konta */}
					<div className='bg-white rounded-lg shadow p-6'>
						<h3 className='text-lg font-bold mb-4'>Informacje o koncie</h3>
						<div className='space-y-3 text-sm'>
							<div>
								<span className='font-semibold'>Utworzone:</span>
								<p className='text-gray-600'>
									{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('pl-PL') : '-'}
								</p>
							</div>
							<div>
								<span className='font-semibold'>Ostatnia aktualizacja:</span>
								<p className='text-gray-600'>
									{user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString('pl-PL') : '-'}
								</p>
							</div>
						</div>
					</div>

					{/* Niebezpieczna strefa */}
					<div className='bg-red-50 border border-red-200 rounded-lg shadow p-6'>
						<h3 className='text-lg font-bold text-red-800 mb-4'>Niebezpieczna strefa</h3>
						<p className='text-sm text-gray-700 mb-4'>
							Usunięcie konta spowoduje trwałe usunięcie wszystkich Twoich danych i rezerwacji.
						</p>
						<button
							onClick={handleDeleteAccount}
							className='bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded w-full'>
							Usuń konto
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ProfilePage
