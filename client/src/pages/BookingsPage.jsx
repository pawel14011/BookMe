import React, { useState } from 'react'
import Layout from '../components/Layout'
import BookingCalendar from '../components/BookingCalendar'
import CreateBookingForm from '../components/CreateBookingForm'
import RoomScheduleViewer from '../components/RoomScheduleViewer'

const BookingsPage = () => {
	const [refreshKey, setRefreshKey] = useState(0)
	const [activeTab, setActiveTab] = useState('my-bookings')

	const handleBookingCreated = () => {
		setRefreshKey(prev => prev + 1)
	}

	return (
		<Layout>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<h1 className='text-3xl font-bold mb-6'>Rezerwacje Sal</h1>

				{/* Zakładki */}
				<div className='mb-6'>
					<div className='border-b border-gray-200'>
						<nav className='-mb-px flex space-x-8'>
							<button
								onClick={() => setActiveTab('my-bookings')}
								className={`${
									activeTab === 'my-bookings'
										? 'border-blue-500 text-blue-600'
										: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
								} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
								Moje Rezerwacje
							</button>
							<button
								onClick={() => setActiveTab('create')}
								className={`${
									activeTab === 'create'
										? 'border-blue-500 text-blue-600'
										: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
								} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
								Nowa Rezerwacja
							</button>
							<button
								onClick={() => setActiveTab('room-schedule')}
								className={`${
									activeTab === 'room-schedule'
										? 'border-blue-500 text-blue-600'
										: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
								} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
								Przeglądaj Sale
							</button>
						</nav>
					</div>
				</div>

				{/* Zawartość */}
				<div className='space-y-6'>
					{activeTab === 'my-bookings' && <BookingCalendar key={refreshKey} />}
					{activeTab === 'create' && <CreateBookingForm onBookingCreated={handleBookingCreated} />}
					{activeTab === 'room-schedule' && <RoomScheduleViewer />}
				</div>
			</div>
		</Layout>
	)
}

export default BookingsPage
