import React, { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { bookingService } from '../services/bookingService'
import moment from 'moment'
import { useAuth } from '../hooks/useAuth'
import EditBookingModal from './EditBookingModal'

const BookingCalendar = () => {
	const [bookings, setBookings] = useState([])
	const [filteredBookings, setFilteredBookings] = useState([])
	const [selectedDate, setSelectedDate] = useState(null)
	const [selectedEvent, setSelectedEvent] = useState(null)
	const [showEventModal, setShowEventModal] = useState(false)
	const [showEditModal, setShowEditModal] = useState(false)
	const [editingBooking, setEditingBooking] = useState(null)
	const [filter, setFilter] = useState('all')
	const { user } = useAuth()

	useEffect(() => {
		fetchBookings()
	}, [])

	useEffect(() => {
		applyFilters()
	}, [bookings, selectedDate, filter])

	const fetchBookings = async () => {
		try {
			const data = await bookingService.getMyBookings()
			setBookings(data.bookings)
		} catch (err) {
			console.error('Błąd podczas pobierania rezerwacji:', err)
		}
	}

	const applyFilters = () => {
		let filtered = [...bookings]

		if (selectedDate) {
			filtered = filtered.filter(booking => {
				const bookingDate = moment(booking.startTime).format('YYYY-MM-DD')
				const filterDate = moment(selectedDate).format('YYYY-MM-DD')
				return bookingDate === filterDate
			})
		}

		const now = moment()
		if (filter === 'upcoming') {
			filtered = filtered.filter(booking => moment(booking.startTime).isAfter(now) && booking.status === 'confirmed')
		} else if (filter === 'past') {
			filtered = filtered.filter(booking => moment(booking.endTime).isBefore(now) || booking.status === 'cancelled')
		}

		filtered.sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
		setFilteredBookings(filtered)
	}

	const handleCancelBooking = async id => {
		if (!window.confirm('Czy na pewno chcesz anulować tę rezerwację?')) return

		try {
			await bookingService.cancelBooking(id)
			alert('Rezerwacja anulowana!')
			setShowEventModal(false)
			fetchBookings()
		} catch (err) {
			alert('Błąd podczas anulowania rezerwacji')
		}
	}

	const handleEditClick = booking => {
		setEditingBooking(booking)
		setShowEditModal(true)
		setShowEventModal(false)
	}

	const getStatusColor = booking => {
		if (booking.status === 'cancelled') return 'bg-red-100 border-red-300'
		if (moment(booking.endTime).isBefore(moment())) return 'bg-gray-100 border-gray-300'
		if (moment(booking.startTime).isBefore(moment())) return 'bg-yellow-100 border-yellow-300'
		return 'bg-green-100 border-green-300'
	}

	const getStatusText = booking => {
		if (booking.status === 'cancelled') return 'Anulowana'
		if (moment(booking.endTime).isBefore(moment())) return 'Zakończona'
		if (moment(booking.startTime).isBefore(moment())) return 'W trakcie'
		return 'Nadchodząca'
	}

	return (
		<div className='bg-white rounded-lg shadow p-6'>
			<h2 className='text-2xl font-bold mb-4'>Moje Rezerwacje</h2>

			{/* Filtry */}
			<div className='mb-6 grid grid-cols-1 md:grid-cols-2 gap-4'>
				<div>
					<label className='block text-gray-700 text-sm font-bold mb-2'>Filtruj po dacie</label>
					<DatePicker
						selected={selectedDate}
						onChange={date => setSelectedDate(date)}
						isClearable
						placeholderText='Wybierz datę'
						dateFormat='dd.MM.yyyy'
						className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500'
					/>
				</div>

				<div>
					<label className='block text-gray-700 text-sm font-bold mb-2'>Status</label>
					<select
						value={filter}
						onChange={e => setFilter(e.target.value)}
						className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500'>
						<option value='all'>Wszystkie</option>
						<option value='upcoming'>Nadchodzące</option>
						<option value='past'>Zakończone/Anulowane</option>
					</select>
				</div>
			</div>

			{/* Statystyki */}
			<div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
				<div className='bg-blue-50 p-4 rounded-lg'>
					<div className='text-sm text-gray-600'>Wszystkie rezerwacje</div>
					<div className='text-2xl font-bold text-blue-600'>{bookings.length}</div>
				</div>
				<div className='bg-green-50 p-4 rounded-lg'>
					<div className='text-sm text-gray-600'>Nadchodzące</div>
					<div className='text-2xl font-bold text-green-600'>
						{bookings.filter(b => moment(b.startTime).isAfter(moment()) && b.status === 'confirmed').length}
					</div>
				</div>
				<div className='bg-red-50 p-4 rounded-lg'>
					<div className='text-sm text-gray-600'>Anulowane</div>
					<div className='text-2xl font-bold text-red-600'>{bookings.filter(b => b.status === 'cancelled').length}</div>
				</div>
			</div>

			{/* Lista rezerwacji */}
			<div className='space-y-4'>
				{filteredBookings.length === 0 ? (
					<div className='text-center py-8 text-gray-500'>Brak rezerwacji do wyświetlenia</div>
				) : (
					filteredBookings.map(booking => (
						<div
							key={booking.id}
							className={`border-l-4 p-4 rounded ${getStatusColor(booking)} cursor-pointer hover:shadow-md transition`}
							onClick={() => {
								setSelectedEvent(booking)
								setShowEventModal(true)
							}}>
							<div className='flex justify-between items-start'>
								<div className='flex-1'>
									<div className='flex items-center gap-2 mb-2'>
										<h3 className='text-lg font-bold text-gray-800'>{booking.Room.name}</h3>
										<span className='text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded'>
											{booking.Room.RoomType.name}
										</span>
										<span
											className={`text-sm px-2 py-1 rounded ${
												booking.status === 'cancelled'
													? 'bg-red-200 text-red-800'
													: moment(booking.endTime).isBefore(moment())
													? 'bg-gray-200 text-gray-800'
													: 'bg-green-200 text-green-800'
											}`}>
											{getStatusText(booking)}
										</span>
									</div>

									<div className='text-sm text-gray-600 space-y-1'>
										<p>
											<strong>📅 Data:</strong> {moment(booking.startTime).format('DD.MM.YYYY')}
										</p>
										<p>
											<strong>🕐 Godziny:</strong> {moment(booking.startTime).format('HH:mm')} -{' '}
											{moment(booking.endTime).format('HH:mm')}
										</p>
										{booking.Room.building && (
											<p>
												<strong>🏢 Budynek:</strong> {booking.Room.building}
												{booking.Room.floor && `, piętro ${booking.Room.floor}`}
											</p>
										)}
										{booking.notes && (
											<p className='mt-2'>
												<strong>📝 Notatka:</strong> {booking.notes}
											</p>
										)}
									</div>
								</div>

								<div className='ml-4 flex flex-col gap-2'>
									{booking.status === 'confirmed' && moment(booking.startTime).isAfter(moment()) && (
										<>
											<button
												onClick={e => {
													e.stopPropagation()
													handleEditClick(booking)
												}}
												className='text-blue-600 hover:text-blue-900 text-sm font-semibold'>
												Edytuj
											</button>
											<button
												onClick={e => {
													e.stopPropagation()
													handleCancelBooking(booking.id)
												}}
												className='text-red-600 hover:text-red-900 text-sm font-semibold'>
												Anuluj
											</button>
										</>
									)}
								</div>
							</div>
						</div>
					))
				)}
			</div>

			{/* Modal szczegółów */}
			{showEventModal && selectedEvent && (
				<div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50'>
					<div className='bg-white rounded-lg p-6 max-w-md w-full'>
						<h3 className='text-xl font-bold mb-4'>Szczegóły Rezerwacji</h3>

						<div className='space-y-3 mb-6'>
							<div>
								<span className='font-semibold'>Sala:</span> {selectedEvent.Room.name}
							</div>
							<div>
								<span className='font-semibold'>Typ:</span> {selectedEvent.Room.RoomType.name}
							</div>
							<div>
								<span className='font-semibold'>Pojemność:</span> {selectedEvent.Room.capacity} osób
							</div>
							{selectedEvent.Room.building && (
								<div>
									<span className='font-semibold'>Budynek:</span> {selectedEvent.Room.building}
									{selectedEvent.Room.floor && `, piętro ${selectedEvent.Room.floor}`}
								</div>
							)}
							<div>
								<span className='font-semibold'>Data:</span> {moment(selectedEvent.startTime).format('DD.MM.YYYY')}
							</div>
							<div>
								<span className='font-semibold'>Godziny:</span> {moment(selectedEvent.startTime).format('HH:mm')} -{' '}
								{moment(selectedEvent.endTime).format('HH:mm')}
							</div>
							<div>
								<span className='font-semibold'>Status:</span>{' '}
								<span
									className={`px-2 py-1 rounded text-sm ${
										selectedEvent.status === 'cancelled' ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'
									}`}>
									{getStatusText(selectedEvent)}
								</span>
							</div>
							{selectedEvent.notes && (
								<div>
									<span className='font-semibold'>Notatka:</span>
									<p className='mt-1 text-gray-700'>{selectedEvent.notes}</p>
								</div>
							)}
						</div>

						<div className='flex gap-2'>
							{selectedEvent.status === 'confirmed' && moment(selectedEvent.startTime).isAfter(moment()) && (
								<>
									<button
										onClick={() => handleEditClick(selectedEvent)}
										className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
										Edytuj
									</button>
									<button
										onClick={() => handleCancelBooking(selectedEvent.id)}
										className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'>
										Anuluj rezerwację
									</button>
								</>
							)}
							<button
								onClick={() => setShowEventModal(false)}
								className='bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded'>
								Zamknij
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Modal edycji */}
			{showEditModal && editingBooking && (
				<EditBookingModal
					booking={editingBooking}
					onClose={() => {
						setShowEditModal(false)
						setEditingBooking(null)
					}}
					onUpdated={fetchBookings}
				/>
			)}
		</div>
	)
}

export default BookingCalendar
