import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Navigate } from 'react-router-dom'
import Layout from '../components/Layout'
import RoomTypeManager from '../components/RoomTypeManager'
import RoomManager from '../components/RoomManager'
import AdminBookingManager from '../components/AdminBookingManager'

const AdminPage = () => {
	const { user, isAdmin } = useAuth()
	const [activeTab, setActiveTab] = useState('rooms')

	if (!isAdmin) {
		return <Navigate to='/dashboard' replace />
	}

	return (
		<Layout>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<h1 className='text-3xl font-bold mb-6'>Panel Administracyjny</h1>

				{/* Zakładki */}
				<div className='mb-6'>
					<div className='border-b border-gray-200'>
						<nav className='-mb-px flex space-x-8'>
							<button
								onClick={() => setActiveTab('rooms')}
								className={`${
									activeTab === 'rooms'
										? 'border-blue-500 text-blue-600'
										: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
								} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
								Zarządzanie Salami
							</button>
							<button
								onClick={() => setActiveTab('types')}
								className={`${
									activeTab === 'types'
										? 'border-blue-500 text-blue-600'
										: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
								} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
								Typy Sal
							</button>
							<button
								onClick={() => setActiveTab('bookings')}
								className={`${
									activeTab === 'bookings'
										? 'border-blue-500 text-blue-600'
										: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
								} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
								Wszystkie Rezerwacje
							</button>
						</nav>
					</div>
				</div>

				{/* Zawartość */}
				<div>
					{activeTab === 'rooms' && <RoomManager />}
					{activeTab === 'types' && <RoomTypeManager />}
					{activeTab === 'bookings' && <AdminBookingManager />}
				</div>
			</div>
		</Layout>
	)
}

export default AdminPage
