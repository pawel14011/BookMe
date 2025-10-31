// backend/controllers/auth.controller.js
const { User } = require('../models')

// ✅ Rejestracja użytkownika (wywoływana z frontendu PO rejestracji w Cognito)
exports.register = async (req, res) => {
	try {
		const { cognitoUserId, email, firstName, lastName, title, subjects } = req.body

		// ✅ Walidacja - cognitoUserId i email są wymagane
		if (!cognitoUserId || !email) {
			return res.status(400).json({
				message: 'cognitoUserId i email są wymagane',
			})
		}

		// ✅ Sprawdzenie czy user już istnieje (po cognitoUserId lub email)
		const existingUser = await User.findOne({
			where: {
				[require('sequelize').Op.or]: [{ cognitoUserId }, { email }],
			},
		})

		if (existingUser) {
			return res.status(400).json({
				message: 'Użytkownik już istnieje w bazie danych',
			})
		}

		// ✅ Tworzenie użytkownika (BEZ hasła!)
		const user = await User.create({
			cognitoUserId,
			email,
			firstName: firstName || null,
			lastName: lastName || null,
			title: title || null,
			subjects: subjects || null,
			emailVerified: false, // Będzie zaktualizowane po potwierdzeniu
			role: 'user',
		})

		return res.status(201).json({
			message: 'Użytkownik zarejestrowany w bazie danych',
			user: {
				id: user.id,
				cognitoUserId: user.cognitoUserId,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
			},
		})
	} catch (error) {
		console.error('Błąd rejestracji:', error)
		return res.status(500).json({
			message: 'Błąd podczas rejestracji',
			error: error.message,
		})
	}
}

// ✅ Potwierdzenie emaila (wywoływane z frontendu PO potwierdzeniu w Cognito)
exports.confirmEmail = async (req, res) => {
	try {
		const { email } = req.body

		if (!email) {
			return res.status(400).json({
				message: 'Email jest wymagany',
			})
		}

		const user = await User.findOne({ where: { email } })

		if (!user) {
			return res.status(404).json({
				message: 'Użytkownik nie znaleziony',
			})
		}

		await user.update({ emailVerified: true })

		return res.status(200).json({
			message: 'Email potwierdzony',
		})
	} catch (error) {
		console.error('Błąd potwierdzenia:', error)
		return res.status(500).json({
			message: 'Błąd podczas potwierdzania emaila',
			error: error.message,
		})
	}
}

exports.getProfile = async (req, res) => {
	try {
		// req.user pochodzi z authMiddleware
		const user = await User.findOne({
			where: { cognitoUserId: req.user.cognitoUserId },
			attributes: { exclude: ['password'] }, // Na wszelki wypadek
		})

		if (!user) {
			return res.status(404).json({
				message: 'Użytkownik nie znaleziony',
			})
		}

		return res.status(200).json({
			user: {
				id: user.id,
				cognitoUserId: user.cognitoUserId,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				title: user.title,
				subjects: user.subjects,
				role: user.role,
				emailVerified: user.emailVerified,
				createdAt: user.createdAt,
			},
		})
	} catch (error) {
		console.error('Błąd pobierania profilu:', error)
		return res.status(500).json({
			message: 'Błąd podczas pobierania profilu',
			error: error.message,
		})
	}
}

// ✅ Aktualizacja profilu użytkownika (wymaga authMiddleware)
exports.updateProfile = async (req, res) => {
	try {
		const { firstName, lastName, title, subjects } = req.body

		const user = await User.findOne({
			where: { cognitoUserId: req.user.cognitoUserId },
		})

		if (!user) {
			return res.status(404).json({
				message: 'Użytkownik nie znaleziony',
			})
		}

		// ✅ Aktualizuj tylko pola, które zostały przesłane
		await user.update({
			firstName: firstName !== undefined ? firstName : user.firstName,
			lastName: lastName !== undefined ? lastName : user.lastName,
			title: title !== undefined ? title : user.title,
			subjects: subjects !== undefined ? subjects : user.subjects,
		})

		return res.status(200).json({
			message: 'Profil zaktualizowany',
			user: {
				id: user.id,
				cognitoUserId: user.cognitoUserId,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				title: user.title,
				subjects: user.subjects,
				role: user.role,
			},
		})
	} catch (error) {
		console.error('Błąd aktualizacji profilu:', error)
		return res.status(500).json({
			message: 'Błąd podczas aktualizacji profilu',
			error: error.message,
		})
	}
}

// ✅ Usuwanie konta użytkownika (wymaga authMiddleware)
exports.deleteAccount = async (req, res) => {
	try {
		const user = await User.findOne({
			where: { cognitoUserId: req.user.cognitoUserId },
		})

		if (!user) {
			return res.status(404).json({
				message: 'Użytkownik nie znaleziony',
			})
		}

		await user.destroy()

		return res.status(200).json({
			message: 'Konto usunięte z bazy danych',
		})
	} catch (error) {
		console.error('Błąd usuwania konta:', error)
		return res.status(500).json({
			message: 'Błąd podczas usuwania konta',
			error: error.message,
		})
	}
}
