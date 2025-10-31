import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const Navbar = () => {
	const { user, logout, isAdmin } = useAuth()
	const location = useLocation()

	const isActive = path => {
		return location.pathname === path
	}

	return (
		<nav className='bg-white shadow-lg'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex justify-between h-16'>
					<div className='flex items-center space-x-8'>
						{/* Logo */}
						<Link to='/dashboard' className='flex items-center'>
							<h1 className='text-xl font-bold text-blue-600'>📚 System Rezerwacji Sal</h1>
						</Link>

						{/* Menu główne */}
						<div className='hidden md:flex space-x-4'>
							<Link
								to='/dashboard'
								className={`${
									isActive('/dashboard')
										? 'text-blue-600 border-b-2 border-blue-600'
										: 'text-gray-700 hover:text-blue-600'
								} px-3 py-2 text-sm font-medium transition`}>
								Dashboard
							</Link>

							<Link
								to='/bookings'
								className={`${
									isActive('/bookings')
										? 'text-blue-600 border-b-2 border-blue-600'
										: 'text-gray-700 hover:text-blue-600'
								} px-3 py-2 text-sm font-medium transition`}>
								Rezerwacje
							</Link>

							<Link
								to='/profile'
								className={`${
									isActive('/profile')
										? 'text-blue-600 border-b-2 border-blue-600'
										: 'text-gray-700 hover:text-blue-600'
								} px-3 py-2 text-sm font-medium transition`}>
								Profil
							</Link>

							{isAdmin && (
								<Link
									to='/admin'
									className={`${
										isActive('/admin')
											? 'text-purple-600 border-b-2 border-purple-600'
											: 'text-purple-500 hover:text-purple-600'
									} px-3 py-2 text-sm font-medium transition`}>
									🔧 Panel Admina
								</Link>
							)}
						</div>
					</div>

					{/* User info i wylogowanie */}
					<div className='flex items-center space-x-4'>
						<div className='text-sm text-right hidden md:block'>
							<div className='font-semibold text-gray-800'>
								{user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email}
							</div>
							{isAdmin && <div className='text-xs text-purple-600 font-semibold'>Administrator</div>}
						</div>

						<button
							onClick={logout}
							className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm transition'>
							Wyloguj
						</button>
					</div>
				</div>

				{/* Mobile menu */}
				<div className='md:hidden pb-3 space-y-1'>
					<Link
						to='/dashboard'
						className={`${
							isActive('/dashboard') ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
						} block px-3 py-2 rounded-md text-sm font-medium`}>
						Dashboard
					</Link>

					<Link
						to='/bookings'
						className={`${
							isActive('/bookings') ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
						} block px-3 py-2 rounded-md text-sm font-medium`}>
						Rezerwacje
					</Link>

					<Link
						to='/profile'
						className={`${
							isActive('/profile') ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
						} block px-3 py-2 rounded-md text-sm font-medium`}>
						Profil
					</Link>

					{isAdmin && (
						<Link
							to='/admin'
							className={`${
								isActive('/admin') ? 'bg-purple-50 text-purple-600' : 'text-purple-500'
							} block px-3 py-2 rounded-md text-sm font-medium`}>
							🔧 Panel Admina
						</Link>
					)}
				</div>
			</div>
		</nav>
	)
}

export default Navbar
