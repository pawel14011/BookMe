import React from 'react'
import Navbar from './Navbar'

const Layout = ({ children }) => {
	return (
		<div className='min-h-screen bg-gray-100'>
			<Navbar />
			<main className='py-6'>{children}</main>
			{/* <footer className='bg-white shadow-lg mt-auto'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
					<p className='text-center text-sm text-gray-500'>
						© 2025 System Rezerwacji Sal Wykładowych. Wszystkie prawa zastrzeżone.
					</p>
				</div>
			</footer> */}
		</div>
	)
}

export default Layout
