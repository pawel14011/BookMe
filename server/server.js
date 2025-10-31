const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { syncDatabase } = require('./models')

// Import routes
const authRoutes = require('./routes/auth.routes')
const roomRoutes = require('./routes/room.routes')
const bookingRoutes = require('./routes/booking.routes')

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Synchronizacja bazy danych
syncDatabase()

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/rooms', roomRoutes)
app.use('/api/bookings', bookingRoutes)

// Test route
app.get('/', (req, res) => {
	res.json({ message: 'Serwer działa poprawnie!' })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
	console.log(`🚀 Serwer uruchomiony na porcie ${PORT}`)
})
