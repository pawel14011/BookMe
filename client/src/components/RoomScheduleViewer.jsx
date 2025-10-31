import React, { useState, useEffect } from 'react'
import { roomService } from '../services/roomService'
import { bookingService } from '../services/bookingService'
import DatePicker from 'react-datepicker'
import moment from 'moment'

const RoomScheduleViewer = () => {
	const [rooms, setRooms] = useState([])
	const [selectedRoom, setSelectedRoom] = useState(null)
	const [startDate, setStartDate] = useState(new Date())
	const [endDate, setEndDate] = useState(moment().add(7, 'days').toDate())
	const [bookings, setBookings] = useState([])
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		fetchRooms()
	}, [])

	const fetchRooms = async () => {
		try {
			const data = await roomService.getAvailableRooms()
			setRooms(data.rooms)
		} catch (err) {
			console.error('Błąd podczas pobierania sal')
		}
	}

	const fetchRoomBookings = async () => {
		if (!selectedRoom) return

		setLoading(true)
		try {
			const response = await bookingService.getRoomBookings(
				selectedRoom,
				startDate.toISOString(),
				endDate.toISOString()
			)
			setBookings(response.bookings || [])
		} catch (err) {
			console.error('Błąd podczas pobierania rezerwacji sali')
			setBookings([])
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (selectedRoom) {
			fetchRoomBookings()
		}
	}, [selectedRoom, startDate, endDate])

	const selectedRoomData = rooms.find(r => r.id === parseInt(selectedRoom))

	return (
		<div className='bg-white rounded-lg shadow p-6'>
			<h2 className='text-2xl font-bold mb-4'>Przeglądaj Dostępność Sal</h2>

			<div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
				{/* Wybór sali */}
				<div>
					<label className='block text-gray-700 text-sm font-bold mb-2'>Wybierz salę</label>
					<select
						value={selectedRoom || ''}
						onChange={e => setSelectedRoom(e.target.value)}
						className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500'>
						<option value=''>Wybierz salę...</option>
						{rooms.map(room => (
							<option key={room.id} value={room.id}>
								{room.name} - {room.RoomType.name}
							</option>
						))}
					</select>
				</div>

				{/* Data od */}
				<div>
					<label className='block text-gray-700 text-sm font-bold mb-2'>Data od</label>
					<DatePicker
						selected={startDate}
						onChange={date => setStartDate(date)}
						dateFormat='dd.MM.yyyy'
						className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500'
					/>
				</div>

				{/* Data do */}
				<div>
					<label className='block text-gray-700 text-sm font-bold mb-2'>Data do</label>
					<DatePicker
						selected={endDate}
						onChange={date => setEndDate(date)}
						minDate={startDate}
						dateFormat='dd.MM.yyyy'
						className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500'
					/>
				</div>
			</div>

			{selectedRoomData && (
				<div className='bg-blue-50 p-4 rounded mb-6'>
					<h3 className='font-bold text-lg mb-2'>{selectedRoomData.name}</h3>
					<div className='grid grid-cols-2 md:grid-cols-4 gap-2 text-sm'>
						<div>
							<span className='font-semibold'>Typ:</span> {selectedRoomData.RoomType.name}
						</div>
						<div>
							<span className='font-semibold'>Pojemność:</span> {selectedRoomData.capacity} osób
						</div>
						{selectedRoomData.building && (
							<div>
								<span className='font-semibold'>Budynek:</span> {selectedRoomData.building}
							</div>
						)}
						{selectedRoomData.floor && (
							<div>
								<span className='font-semibold'>Piętro:</span> {selectedRoomData.floor}
							</div>
						)}
					</div>
				</div>
			)}

			{selectedRoom && (
				<div>
					<h3 className='text-xl font-bold mb-4'>
						Rezerwacje ({moment(startDate).format('DD.MM.YYYY')} - {moment(endDate).format('DD.MM.YYYY')})
					</h3>

					{loading ? (
						<div className='text-center py-8'>
							<p className='text-gray-500'>Ładowanie...</p>
						</div>
					) : bookings.length === 0 ? (
						<div className='bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded'>
							✅ Sala jest wolna w wybranym okresie!
						</div>
					) : (
						<div className='space-y-3'>
							{bookings.map(booking => (
								<div key={booking.id} className='border-l-4 border-blue-500 bg-blue-50 p-4 rounded'>
									<div className='flex justify-between items-start'>
										<div className='flex-1'>
											<div className='font-semibold text-gray-800'>
												{moment(booking.startTime).format('DD.MM.YYYY')}
											</div>
											<div className='text-sm text-gray-600'>
												🕐 {moment(booking.startTime).format('HH:mm')} - {moment(booking.endTime).format('HH:mm')}
											</div>
											<div className='text-sm text-gray-600 mt-1'>
												👤{' '}
												{booking.User.firstName && booking.User.lastName
													? `${booking.User.firstName} ${booking.User.lastName}`
													: booking.User.email}
											</div>
											{booking.notes && <div className='text-sm text-gray-700 mt-2'>📝 {booking.notes}</div>}
										</div>
										<div>
											<span
												className={`text-xs px-2 py-1 rounded ${
													booking.status === 'confirmed' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
												}`}>
												{booking.status === 'confirmed' ? 'Potwierdzona' : 'Anulowana'}
											</span>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	)
}

export default RoomScheduleViewer
