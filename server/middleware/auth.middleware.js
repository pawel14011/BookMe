// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken')
const jwksClient = require('jwks-rsa')
const { User } = require('../models')

// ✅ Konfiguracja JWKS client dla Cognito
const client = jwksClient({
	jwksUri: process.env.JWKS_URI,
	cache: true,
	cacheMaxAge: 86400000, // 24 godziny
})

// Funkcja do pobrania klucza publicznego z Cognito
function getKey(header, callback) {
	client.getSigningKey(header.kid, (err, key) => {
		if (err) {
			callback(err)
			return
		}
		const signingKey = key.publicKey || key.rsaPublicKey
		callback(null, signingKey)
	})
}

// ✅ Middleware do weryfikacji JWT tokenu z Cognito
const authMiddleware = async (req, res, next) => {
	try {
		const token = req.headers.authorization?.split(' ')[1]

		if (!token) {
			return res.status(401).json({
				message: 'Brak tokenu autentykacji',
			})
		}

		// ✅ Weryfikuj token JWT z Cognito (asynchronicznie)
		jwt.verify(
			token,
			getKey,
			{
				issuer: process.env.USER_POOL_URL,
				algorithms: ['RS256'],
			},
			async (err, decoded) => {
				if (err) {
					console.error('Błąd weryfikacji tokenu:', err)
					return res.status(401).json({
						message: 'Nieprawidłowy token',
					})
				}

				try {
					// ✅ Pobierz dane użytkownika z bazy danych
					const user = await User.findOne({
						where: { cognitoUserId: decoded.sub },
					})

					if (!user) {
						return res.status(404).json({
							message: 'Użytkownik nie znaleziony',
						})
					}

					// ✅ Dodaj dane użytkownika do req
					req.user = {
						id: user.id,
						cognitoUserId: decoded.sub,
						email: decoded.email,
						emailVerified: decoded.email_verified,
						role: user.role, // Z bazy danych!
						firstName: user.firstName,
						lastName: user.lastName,
					}

					next()
				} catch (dbError) {
					console.error('Błąd pobierania użytkownika:', dbError)
					return res.status(500).json({
						message: 'Błąd serwera',
					})
				}
			}
		)
	} catch (error) {
		console.error('Błąd autentykacji:', error)
		return res.status(401).json({
			message: 'Błąd autentykacji',
		})
	}
}

// ✅ Middleware do sprawdzenia roli admin
const adminMiddleware = (req, res, next) => {
	if (!req.user) {
		return res.status(401).json({
			message: 'Brak autentykacji',
		})
	}

	if (req.user.role !== 'admin') {
		return res.status(403).json({
			message: 'Brak dostępu - wymagane uprawnienia administratora',
		})
	}

	next()
}

module.exports = { authMiddleware, adminMiddleware }
