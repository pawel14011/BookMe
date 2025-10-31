import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { Link } from 'react-router-dom'

const DashboardPage = () => {
	const { user, logout, isAdmin } = useAuth()

	return (
		<div className='min-h-screen bg-gray-100'>
			<nav className='bg-white shadow-lg'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex justify-between h-16'>
						<div className='flex items-center space-x-4'>
							<h1 className='text-xl font-bold text-gray-800'>System Rezerwacji Sal</h1>
							<Link to='/bookings' className='text-blue-600 hover:text-blue-900 font-semibold'>
								Rezerwacje
							</Link>
							{isAdmin && (
								<Link to='/admin' className='text-purple-600 hover:text-purple-900 font-semibold'>
									Panel Admina
								</Link>
							)}
						</div>
						<div className='flex items-center space-x-4'>
							<span className='text-gray-700'>
								{user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email}
							</span>
							{isAdmin && <span className='bg-purple-500 text-white px-3 py-1 rounded-full text-sm'>Admin</span>}
							<button onClick={logout} className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'>
								Wyloguj
							</button>
						</div>
					</div>
				</div>
			</nav>

			<div className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
				<div className='px-4 py-6 sm:px-0'>
					<div className='bg-white rounded-lg shadow p-6'>
						<h2 className='text-2xl font-bold mb-4'>Witaj w systemie rezerwacji sal!</h2>
						<p className='text-gray-600 mb-4'>Email: {user?.email}</p>
						{user?.title && <p className='text-gray-600 mb-4'>Tytuł: {user.title}</p>}
						{user?.subjects && <p className='text-gray-600 mb-4'>Prowadzone przedmioty: {user.subjects}</p>}

						<div className='mt-6'>
							<Link
								to='/bookings'
								className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-block'>
								Przejdź do rezerwacji
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default DashboardPage
