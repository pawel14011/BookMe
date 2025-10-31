const express = require('express')
const authController = require('../controllers/auth.controller')
const { authMiddleware } = require('../middleware/auth.middleware')

const router = express.Router()

// Publiczne routes
router.post('/register', authController.register)
router.post('/login', authController.login)

// Chronione routes (wymagają JWT)
router.get('/profile', authMiddleware, authController.getProfile)
router.put('/profile', authMiddleware, authController.updateProfile)
router.delete('/account', authMiddleware, authController.deleteAccount)

module.exports = router
