const express = require('express')
const roomController = require('../controllers/room.controller')
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware')

const router = express.Router()

// Publiczne routes (dostępne dla zalogowanych użytkowników)
router.get('/types', authMiddleware, roomController.getAllRoomTypes)
router.get('/available', authMiddleware, roomController.getAvailableRooms)
router.get('/:id', authMiddleware, roomController.getRoomById)

// Admin routes
router.get('/', authMiddleware, adminMiddleware, roomController.getAllRooms)
router.post('/', authMiddleware, adminMiddleware, roomController.createRoom)
router.put('/:id', authMiddleware, adminMiddleware, roomController.updateRoom)
router.patch('/:id/name', authMiddleware, adminMiddleware, roomController.updateRoomName)
router.delete('/:id', authMiddleware, adminMiddleware, roomController.deleteRoom)

// Admin routes dla typów sal
router.post('/types', authMiddleware, adminMiddleware, roomController.createRoomType)
router.delete('/types/:id', authMiddleware, adminMiddleware, roomController.deleteRoomType)

module.exports = router
