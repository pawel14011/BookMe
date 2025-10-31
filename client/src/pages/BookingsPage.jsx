import React, { useState } from 'react'
import BookingCalendar from '../components/BookingCalendar'
import CreateBookingForm from '../components/CreateBookingForm'

const BookingsPage = () => {
	const [refreshKey, setRefreshKey] = useState(0)

	const handleBookingCreated = () => {
		// Odśwież kalendarz po utworzeniu rezerwacji
		setRefreshKey(prev => prev + 1)
	}

	return (
		<div className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
			<h1 className='text-3xl font-bold mb-6'>Rezerwacje Sal</h1>

			<div className='space-y-6'>
				{/* Formularz tworzenia rezerwacji */}
				<CreateBookingForm onBookingCreated={handleBookingCreated} />

				{/* Kalendarz rezerwacji */}
				<BookingCalendar key={refreshKey} />
			</div>
		</div>
	)
}

export default BookingsPage
