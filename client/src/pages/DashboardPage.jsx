import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'

const DashboardPage = () => {
	const { user, isAdmin } = useAuth()

	return (
		<Layout>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='bg-white rounded-lg shadow p-6'>
					<h2 className='text-2xl font-bold mb-4'>Witaj w systemie rezerwacji sal!</h2>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
						<div className='bg-blue-50 p-6 rounded-lg'>
							<h3 className='text-lg font-semibold text-blue-800 mb-2'>👤 Twoje dane</h3>
							<div className='space-y-2 text-sm'>
								<p>
									<strong>Email:</strong> {user?.email}
								</p>
								{user?.title && (
									<p>
										<strong>Tytuł:</strong> {user.title}
									</p>
								)}
								{user?.firstName && user?.lastName && (
									<p>
										<strong>Imię i nazwisko:</strong> {user.firstName} {user.lastName}
									</p>
								)}
								{user?.subjects && (
									<p>
										<strong>Przedmioty:</strong> {user.subjects}
									</p>
								)}
							</div>
						</div>

						<div className='bg-green-50 p-6 rounded-lg'>
							<h3 className='text-lg font-semibold text-green-800 mb-2'>🎯 Szybkie akcje</h3>
							<div className='space-y-2'>
								<Link
									to='/bookings'
									className='block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center'>
									📅 Przejdź do rezerwacji
								</Link>
								<Link
									to='/profile'
									className='block bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded text-center'>
									⚙️ Edytuj profil
								</Link>
								{isAdmin && (
									<Link
										to='/admin'
										className='block bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded text-center'>
										🔧 Panel Admina
									</Link>
								)}
							</div>
						</div>
					</div>

					<div className='bg-yellow-50 border-l-4 border-yellow-400 p-4'>
						<h4 className='font-semibold text-yellow-800 mb-2'>💡 Jak korzystać z systemu?</h4>
						<ul className='text-sm text-gray-700 space-y-1'>
							<li>
								• Przejdź do zakładki <strong>Rezerwacje</strong> aby zarezerwować salę
							</li>
							<li>
								• W zakładce <strong>Moje Rezerwacje</strong> zobaczysz wszystkie swoje rezerwacje
							</li>
							<li>
								• W zakładce <strong>Przeglądaj Sale</strong> możesz sprawdzić dostępność konkretnej sali
							</li>
							<li>
								• W zakładce <strong>Profil</strong> możesz edytować swoje dane osobowe
							</li>
							{isAdmin && (
								<li>• Jako admin masz dostęp do zarządzania salami i rezerwacjami wszystkich użytkowników</li>
							)}
						</ul>
					</div>
				</div>
			</div>
		</Layout>
	)
}

export default DashboardPage
