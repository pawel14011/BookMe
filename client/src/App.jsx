import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import AdminPage from './pages/AdminPage'
import ProtectedRoute from './components/ProtectedRoute'
import BookingsPage from './pages/BookingsPage'
import './index.css'

function App() {
	return (
		<Router>
			<AuthProvider>
				<Routes>
					<Route path='/login' element={<LoginPage />} />
					<Route path='/dashboard' element={<ProtectedRoute component={DashboardPage} />} />
					<Route path='/admin' element={<ProtectedRoute component={AdminPage} />} />
					<Route path='/bookings' element={<ProtectedRoute component={BookingsPage} />} />
					<Route path='/' element={<Navigate to='/dashboard' replace />} />
				</Routes>
			</AuthProvider>
		</Router>
	)
}

export default App
