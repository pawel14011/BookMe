const express = require('express')
const bookingController = require('../controllers/booking.controller')
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware')

const router = express.Router()

// Publiczne routes dla zalogowanych użytkowników
router.get('/my-bookings', authMiddleware, bookingController.getUserBookings)
router.post('/check-availability', authMiddleware, bookingController.checkRoomAvailability)
router.post('/', authMiddleware, bookingController.createBooking)

// router.get('/room/:roomId', authMiddleware, bookingController.getRoomBookings)
router.get('/room', authMiddleware, bookingController.getRoomBookings)

router.put('/:id', authMiddleware, bookingController.updateBooking)
router.patch('/:id/cancel', authMiddleware, bookingController.cancelBooking)

// Admin routes
router.get('/', authMiddleware, adminMiddleware, bookingController.getAllBookings)
router.delete('/:id', authMiddleware, adminMiddleware, bookingController.deleteBooking)
router.get('/user/:userId', authMiddleware, adminMiddleware, bookingController.getUserBookingsByAdmin)

module.exports = router
