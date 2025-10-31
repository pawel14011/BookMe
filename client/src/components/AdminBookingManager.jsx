import React, { useState, useEffect } from 'react'
import { bookingService } from '../services/bookingService'
import DatePicker from 'react-datepicker'
import moment from 'moment'

const AdminBookingManager = () => {
	const [bookings, setBookings] = useState([])
	const [filteredBookings, setFilteredBookings] = useState([])
	const [selectedDate, setSelectedDate] = useState(null)
	const [filter, setFilter] = useState('all')
	const [searchTerm, setSearchTerm] = useState('')
	const [selectedBooking, setSelectedBooking] = useState(null)
	const [showModal, setShowModal] = useState(false)

	useEffect(() => {
		fetchAllBookings()
	}, [])

	useEffect(() => {
		applyFilters()
	}, [bookings, selectedDate, filter, searchTerm])

	const fetchAllBookings = async () => {
		try {
			const data = await bookingService.getAllBookings()
			setBookings(data.bookings)
		} catch (err) {
			console.error('Błąd podczas pobierania rezerwacji:', err)
		}
	}

	const applyFilters = () => {
		let filtered = [...bookings]

		// Filtr po dacie
		if (selectedDate) {
			filtered = filtered.filter(booking => {
				const bookingDate = moment(booking.startTime).format('YYYY-MM-DD')
				const filterDate = moment(selectedDate).format('YYYY-MM-DD')
				return bookingDate === filterDate
			})
		}

		// Filtr po statusie
		const now = moment()
		if (filter === 'upcoming') {
			filtered = filtered.filter(booking => moment(booking.startTime).isAfter(now) && booking.status === 'confirmed')
		} else if (filter === 'past') {
			filtered = filtered.filter(booking => moment(booking.endTime).isBefore(now))
		} else if (filter === 'cancelled') {
			filtered = filtered.filter(booking => booking.status === 'cancelled')
		}

		// Wyszukiwanie
		if (searchTerm) {
			filtered = filtered.filter(
				booking =>
					booking.Room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					booking.User.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
					(booking.User.firstName && booking.User.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
					(booking.User.lastName && booking.User.lastName.toLowerCase().includes(searchTerm.toLowerCase()))
			)
		}

		filtered.sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
		setFilteredBookings(filtered)
	}

	const handleDeleteBooking = async id => {
		if (!window.confirm('Czy na pewno chcesz usunąć tę rezerwację?')) return

		try {
			await bookingService.deleteBooking(id)
			alert('Rezerwacja usunięta!')
			fetchAllBookings()
		} catch (err) {
			alert('Błąd podczas usuwania rezerwacji')
		}
	}

	const handleCancelBooking = async id => {
		if (!window.confirm('Czy na pewno chcesz anulować tę rezerwację?')) return

		try {
			await bookingService.cancelBooking(id)
			alert('Rezerwacja anulowana!')
			fetchAllBookings()
		} catch (err) {
			alert('Błąd podczas anulowania rezerwacji')
		}
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
			<h2 className='text-2xl font-bold mb-4'>Zarządzanie Rezerwacjami</h2>

			{/* Statystyki */}
			<div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
				<div className='bg-blue-50 p-4 rounded-lg'>
					<div className='text-sm text-gray-600'>Wszystkie</div>
					<div className='text-2xl font-bold text-blue-600'>{bookings.length}</div>
				</div>
				<div className='bg-green-50 p-4 rounded-lg'>
					<div className='text-sm text-gray-600'>Nadchodzące</div>
					<div className='text-2xl font-bold text-green-600'>
						{bookings.filter(b => moment(b.startTime).isAfter(moment()) && b.status === 'confirmed').length}
					</div>
				</div>
				<div className='bg-yellow-50 p-4 rounded-lg'>
					<div className='text-sm text-gray-600'>W trakcie</div>
					<div className='text-2xl font-bold text-yellow-600'>
						{
							bookings.filter(
								b =>
									moment(b.startTime).isBefore(moment()) &&
									moment(b.endTime).isAfter(moment()) &&
									b.status === 'confirmed'
							).length
						}
					</div>
				</div>
				<div className='bg-red-50 p-4 rounded-lg'>
					<div className='text-sm text-gray-600'>Anulowane</div>
					<div className='text-2xl font-bold text-red-600'>{bookings.filter(b => b.status === 'cancelled').length}</div>
				</div>
			</div>

			{/* Filtry i wyszukiwanie */}
			<div className='mb-6 grid grid-cols-1 md:grid-cols-3 gap-4'>
				<div>
					<label className='block text-gray-700 text-sm font-bold mb-2'>Wyszukaj</label>
					<input
						type='text'
						value={searchTerm}
						onChange={e => setSearchTerm(e.target.value)}
						placeholder='Szukaj po sali lub użytkowniku...'
						className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500'
					/>
				</div>

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
						<option value='past'>Zakończone</option>
						<option value='cancelled'>Anulowane</option>
					</select>
				</div>
			</div>

			{/* Lista rezerwacji */}
			<div className='space-y-4'>
				{filteredBookings.length === 0 ? (
					<div className='text-center py-8 text-gray-500'>Brak rezerwacji do wyświetlenia</div>
				) : (
					filteredBookings.map(booking => (
						<div key={booking.id} className={`border-l-4 p-4 rounded ${getStatusColor(booking)}`}>
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

									<div className='grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600'>
										<div>
											<strong>👤 Użytkownik:</strong>{' '}
											{booking.User.firstName && booking.User.lastName
												? `${booking.User.firstName} ${booking.User.lastName}`
												: booking.User.email}
										</div>
										<div>
											<strong>📅 Data:</strong> {moment(booking.startTime).format('DD.MM.YYYY')}
										</div>
										<div>
											<strong>🕐 Godziny:</strong> {moment(booking.startTime).format('HH:mm')} -{' '}
											{moment(booking.endTime).format('HH:mm')}
										</div>
										{booking.Room.building && (
											<div>
												<strong>🏢 Budynek:</strong> {booking.Room.building}
												{booking.Room.floor && `, piętro ${booking.Room.floor}`}
											</div>
										)}
									</div>

									{booking.notes && (
										<div className='mt-2 text-sm text-gray-700'>
											<strong>📝 Notatka:</strong> {booking.notes}
										</div>
									)}
								</div>

								<div className='ml-4 flex flex-col gap-2'>
									<button
										onClick={() => {
											setSelectedBooking(booking)
											setShowModal(true)
										}}
										className='text-blue-600 hover:text-blue-900 text-sm font-semibold'>
										Szczegóły
									</button>
									{booking.status === 'confirmed' && moment(booking.startTime).isAfter(moment()) && (
										<button
											onClick={() => handleCancelBooking(booking.id)}
											className='text-yellow-600 hover:text-yellow-900 text-sm font-semibold'>
											Anuluj
										</button>
									)}
									<button
										onClick={() => handleDeleteBooking(booking.id)}
										className='text-red-600 hover:text-red-900 text-sm font-semibold'>
										Usuń
									</button>
								</div>
							</div>
						</div>
					))
				)}
			</div>

			{/* Modal szczegółów */}
			{showModal && selectedBooking && (
				<div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50'>
					<div className='bg-white rounded-lg p-6 max-w-2xl w-full'>
						<h3 className='text-xl font-bold mb-4'>Szczegóły Rezerwacji #{selectedBooking.id}</h3>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
							<div>
								<h4 className='font-semibold text-gray-700 mb-2'>Informacje o sali</h4>
								<div className='space-y-1 text-sm'>
									<p>
										<strong>Nazwa:</strong> {selectedBooking.Room.name}
									</p>
									<p>
										<strong>Typ:</strong> {selectedBooking.Room.RoomType.name}
									</p>
									<p>
										<strong>Pojemność:</strong> {selectedBooking.Room.capacity} osób
									</p>
									{selectedBooking.Room.building && (
										<p>
											<strong>Budynek:</strong> {selectedBooking.Room.building}
										</p>
									)}
									{selectedBooking.Room.floor && (
										<p>
											<strong>Piętro:</strong> {selectedBooking.Room.floor}
										</p>
									)}
								</div>
							</div>

							<div>
								<h4 className='font-semibold text-gray-700 mb-2'>Informacje o rezerwacji</h4>
								<div className='space-y-1 text-sm'>
									<p>
										<strong>Data:</strong> {moment(selectedBooking.startTime).format('DD.MM.YYYY')}
									</p>
									<p>
										<strong>Godziny:</strong> {moment(selectedBooking.startTime).format('HH:mm')} -{' '}
										{moment(selectedBooking.endTime).format('HH:mm')}
									</p>
									<p>
										<strong>Status:</strong>{' '}
										<span
											className={`px-2 py-1 rounded text-xs ${
												selectedBooking.status === 'cancelled'
													? 'bg-red-200 text-red-800'
													: 'bg-green-200 text-green-800'
											}`}>
											{getStatusText(selectedBooking)}
										</span>
									</p>
									<p>
										<strong>Utworzona:</strong> {moment(selectedBooking.createdAt).format('DD.MM.YYYY HH:mm')}
									</p>
								</div>
							</div>

							<div>
								<h4 className='font-semibold text-gray-700 mb-2'>Użytkownik</h4>
								<div className='space-y-1 text-sm'>
									<p>
										<strong>Email:</strong> {selectedBooking.User.email}
									</p>
									{selectedBooking.User.firstName && (
										<p>
											<strong>Imię:</strong> {selectedBooking.User.firstName}
										</p>
									)}
									{selectedBooking.User.lastName && (
										<p>
											<strong>Nazwisko:</strong> {selectedBooking.User.lastName}
										</p>
									)}
								</div>
							</div>

							{selectedBooking.notes && (
								<div>
									<h4 className='font-semibold text-gray-700 mb-2'>Notatka</h4>
									<p className='text-sm text-gray-700'>{selectedBooking.notes}</p>
								</div>
							)}
						</div>

						<div className='flex gap-2'>
							{selectedBooking.status === 'confirmed' && moment(selectedBooking.startTime).isAfter(moment()) && (
								<button
									onClick={() => {
										handleCancelBooking(selectedBooking.id)
										setShowModal(false)
									}}
									className='bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded'>
									Anuluj rezerwację
								</button>
							)}
							<button
								onClick={() => {
									handleDeleteBooking(selectedBooking.id)
									setShowModal(false)
								}}
								className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'>
								Usuń rezerwację
							</button>
							<button
								onClick={() => setShowModal(false)}
								className='bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded'>
								Zamknij
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default AdminBookingManager
