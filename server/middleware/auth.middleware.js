const jwt = require('jsonwebtoken')
require('dotenv').config()

// Middleware do weryfikacji JWT tokenu
const authMiddleware = (req, res, next) => {
	try {
		const token = req.headers.authorization?.split(' ')[1]
		console.log(token)
		if (!token) {
			return res.status(401).json({
				message: 'Brak tokenu autentykacji',
			})
		}
		// console.log(process.env.JWT_SECRET)
		const decoded = jwt.verify(token, process.env.JWT_SECRET)
		req.user = decoded
		// console.log(decoded)
		next()
	} catch (error) {
		return res.status(401).json({
			message: 'Nieprawidłowy token',
		})
	}
}

// Middleware do sprawdzenia roli admin
const adminMiddleware = (req, res, next) => {
	if (req.user.role !== 'admin') {
		return res.status(403).json({
			message: 'Brak dostępu - wymagane uprawnienia administratora',
		})
	}
	next()
}

module.exports = { authMiddleware, adminMiddleware }
