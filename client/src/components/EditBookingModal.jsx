import React, { useState, useEffect } from 'react'
import { bookingService } from '../services/bookingService'
import moment from 'moment'

const EditBookingModal = ({ booking, onClose, onUpdated }) => {
	const [formData, setFormData] = useState({
		startDate: '',
		startTime: '',
		endDate: '',
		endTime: '',
		notes: '',
	})
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [availability, setAvailability] = useState(null)

	useEffect(() => {
		if (booking) {
			const start = moment(booking.startTime)
			const end = moment(booking.endTime)

			setFormData({
				startDate: start.format('YYYY-MM-DD'),
				startTime: start.format('HH:mm'),
				endDate: end.format('YYYY-MM-DD'),
				endTime: end.format('HH:mm'),
				notes: booking.notes || '',
			})
		}
	}, [booking])

	const handleChange = e => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		})
		setError('')
		setAvailability(null)
	}

	const handleCheckAvailability = async () => {
		const startDateTime = `${formData.startDate}T${formData.startTime}:00`
		const endDateTime = `${formData.endDate}T${formData.endTime}:00`

		try {
			const result = await bookingService.checkAvailability({
				roomId: booking.RoomId,
				startTime: startDateTime,
				endTime: endDateTime,
			})

			// Jeśli rezerwacja koliduje tylko z samą sobą, to jest OK
			setAvailability(result)
		} catch (err) {
			setError('Błąd podczas sprawdzania dostępności')
		}
	}

	const handleSubmit = async e => {
		e.preventDefault()
		setLoading(true)
		setError('')

		const startDateTime = `${formData.startDate}T${formData.startTime}:00`
		const endDateTime = `${formData.endDate}T${formData.endTime}:00`

		try {
			await bookingService.updateBooking(booking.id, {
				startTime: startDateTime,
				endTime: endDateTime,
				notes: formData.notes,
			})

			alert('Rezerwacja zaktualizowana!')
			onUpdated()
			onClose()
		} catch (err) {
			setError(err.response?.data?.message || 'Błąd podczas aktualizacji rezerwacji')
		} finally {
			setLoading(false)
		}
	}

	if (!booking) return null

	return (
		<div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50'>
			<div className='bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
				<h3 className='text-2xl font-bold mb-4'>Edytuj Rezerwację</h3>

				<div className='bg-blue-50 p-4 rounded mb-4'>
					<p className='font-semibold'>Sala: {booking.Room.name}</p>
					<p className='text-sm text-gray-600'>Typ: {booking.Room.RoomType.name}</p>
					{booking.Room.building && (
						<p className='text-sm text-gray-600'>
							Budynek: {booking.Room.building}
							{booking.Room.floor && `, piętro ${booking.Room.floor}`}
						</p>
					)}
				</div>

				{error && <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>{error}</div>}

				{availability && (
					<div
						className={`${
							availability.available
								? 'bg-green-100 border-green-400 text-green-700'
								: 'bg-red-100 border-red-400 text-red-700'
						} border px-4 py-3 rounded mb-4`}>
						{availability.message}
					</div>
				)}

				<form onSubmit={handleSubmit}>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						{/* Data początkowa */}
						<div>
							<label className='block text-gray-700 text-sm font-bold mb-2'>
								Data rozpoczęcia <span className='text-red-500'>*</span>
							</label>
							<input
								type='date'
								name='startDate'
								value={formData.startDate}
								onChange={handleChange}
								min={moment().format('YYYY-MM-DD')}
								className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500'
								required
							/>
						</div>

						{/* Godzina początkowa */}
						<div>
							<label className='block text-gray-700 text-sm font-bold mb-2'>
								Godzina rozpoczęcia <span className='text-red-500'>*</span>
							</label>
							<input
								type='time'
								name='startTime'
								value={formData.startTime}
								onChange={handleChange}
								className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500'
								required
							/>
						</div>

						{/* Data końcowa */}
						<div>
							<label className='block text-gray-700 text-sm font-bold mb-2'>
								Data zakończenia <span className='text-red-500'>*</span>
							</label>
							<input
								type='date'
								name='endDate'
								value={formData.endDate}
								onChange={handleChange}
								min={formData.startDate || moment().format('YYYY-MM-DD')}
								className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500'
								required
							/>
						</div>

						{/* Godzina końcowa */}
						<div>
							<label className='block text-gray-700 text-sm font-bold mb-2'>
								Godzina zakończenia <span className='text-red-500'>*</span>
							</label>
							<input
								type='time'
								name='endTime'
								value={formData.endTime}
								onChange={handleChange}
								className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500'
								required
							/>
						</div>

						{/* Notatka */}
						<div className='md:col-span-2'>
							<label className='block text-gray-700 text-sm font-bold mb-2'>Notatka / Opis zajęć</label>
							<textarea
								name='notes'
								value={formData.notes}
								onChange={handleChange}
								className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500'
								rows='3'
								placeholder='Co będzie się odbywać podczas tej rezerwacji...'
							/>
						</div>
					</div>

					<div className='flex gap-2 mt-6'>
						<button
							type='button'
							onClick={handleCheckAvailability}
							className='bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded'>
							Sprawdź dostępność
						</button>
						<button
							type='submit'
							disabled={loading || (availability && !availability.available)}
							className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50'>
							{loading ? 'Zapisywanie...' : 'Zapisz zmiany'}
						</button>
						<button
							type='button'
							onClick={onClose}
							className='bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded'>
							Anuluj
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default EditBookingModal
