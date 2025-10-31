import React, { useState, useEffect } from 'react'
import { roomService } from '../services/roomService'
import { bookingService } from '../services/bookingService'
import moment from 'moment'

const CreateBookingForm = ({ onBookingCreated }) => {
	const [roomTypes, setRoomTypes] = useState([])
	const [rooms, setRooms] = useState([])
	const [filteredRooms, setFilteredRooms] = useState([])

	const [formData, setFormData] = useState({
		roomTypeId: '',
		roomId: '',
		startDate: '',
		startTime: '',
		endDate: '',
		endTime: '',
		notes: '',
	})

	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	const [availability, setAvailability] = useState(null)

	useEffect(() => {
		fetchRoomTypes()
		fetchRooms()
	}, [])

	useEffect(() => {
		if (formData.roomTypeId) {
			const filtered = rooms.filter(room => room.RoomTypeId === parseInt(formData.roomTypeId))
			setFilteredRooms(filtered)
		} else {
			setFilteredRooms(rooms)
		}
	}, [formData.roomTypeId, rooms])

	const fetchRoomTypes = async () => {
		try {
			const data = await roomService.getAllRoomTypes()
			setRoomTypes(data.roomTypes)
		} catch (err) {
			console.error('Błąd podczas pobierania typów sal')
		}
	}

	const fetchRooms = async () => {
		try {
			const data = await roomService.getAvailableRooms()
			setRooms(data.rooms)
			setFilteredRooms(data.rooms)
		} catch (err) {
			console.error('Błąd podczas pobierania sal')
		}
	}

	const handleChange = e => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		})
		setError('')
		setAvailability(null)
	}

	const handleCheckAvailability = async () => {
		if (!formData.roomId || !formData.startDate || !formData.startTime || !formData.endDate || !formData.endTime) {
			setError('Wypełnij wszystkie pola aby sprawdzić dostępność')
			return
		}

		const startDateTime = `${formData.startDate}T${formData.startTime}:00`
		const endDateTime = `${formData.endDate}T${formData.endTime}:00`

		try {
			const result = await bookingService.checkAvailability({
				roomId: formData.roomId,
				startTime: startDateTime,
				endTime: endDateTime,
			})
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
			await bookingService.createBooking({
				roomId: formData.roomId,
				startTime: startDateTime,
				endTime: endDateTime,
				notes: formData.notes,
			})

			alert('Rezerwacja utworzona pomyślnie!')
			setFormData({
				roomTypeId: '',
				roomId: '',
				startDate: '',
				startTime: '',
				endDate: '',
				endTime: '',
				notes: '',
			})
			setAvailability(null)

			if (onBookingCreated) onBookingCreated()
		} catch (err) {
			setError(err.response?.data?.message || 'Błąd podczas tworzenia rezerwacji')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='bg-white rounded-lg shadow p-6'>
			<h2 className='text-2xl font-bold mb-4'>Nowa Rezerwacja</h2>

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
					{/* Filtr po typie sali */}
					<div>
						<label className='block text-gray-700 text-sm font-bold mb-2'>Typ sali (filtr)</label>
						<select
							name='roomTypeId'
							value={formData.roomTypeId}
							onChange={handleChange}
							className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500'>
							<option value=''>Wszystkie typy</option>
							{roomTypes.map(type => (
								<option key={type.id} value={type.id}>
									{type.name}
								</option>
							))}
						</select>
					</div>

					{/* Wybór sali */}
					<div>
						<label className='block text-gray-700 text-sm font-bold mb-2'>
							Sala <span className='text-red-500'>*</span>
						</label>
						<select
							name='roomId'
							value={formData.roomId}
							onChange={handleChange}
							className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500'
							required>
							<option value=''>Wybierz salę</option>
							{filteredRooms.map(room => (
								<option key={room.id} value={room.id}>
									{room.name} - {room.RoomType.name} (poj. {room.capacity})
								</option>
							))}
						</select>
					</div>

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
						{loading ? 'Rezerwowanie...' : 'Zarezerwuj'}
					</button>
				</div>
			</form>
		</div>
	)
}

export default CreateBookingForm
