const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User } = require('../models')
require('dotenv').config()

// Rejestracja użytkownika
exports.register = async (req, res) => {
	try {
		const { email, password, firstName, lastName, title, subjects } = req.body

		// Walidacja
		if (!email || !password) {
			return res.status(400).json({
				message: 'Email i hasło są wymagane',
			})
		}

		// Sprawdzenie czy user już istnieje
		const existingUser = await User.findOne({ where: { email } })
		if (existingUser) {
			return res.status(400).json({
				message: 'Użytkownik z tym emailem już istnieje',
			})
		}

		// Hashowanie hasła
		const hashedPassword = await bcrypt.hash(password, 10)

		// Tworzenie użytkownika
		const user = await User.create({
			email,
			password: hashedPassword,
			firstName: firstName || null,
			lastName: lastName || null,
			title: title || null,
			subjects: subjects || null,
			role: 'user',
		})

		return res.status(201).json({
			message: 'Rejestracja pomyślna!',
			user: {
				id: user.id,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
			},
		})
	} catch (error) {
		console.error(error)
		return res.status(500).json({
			message: 'Błąd podczas rejestracji',
			error: error.message,
		})
	}
}

// Logowanie użytkownika
exports.login = async (req, res) => {
	try {
		const { email, password } = req.body

		// Walidacja
		if (!email || !password) {
			return res.status(400).json({
				message: 'Email i hasło są wymagane',
			})
		}

		// Szukanie użytkownika
		const user = await User.findOne({ where: { email } })
		if (!user) {
			return res.status(401).json({
				message: 'Błędne dane logowania',
			})
		}

		// Sprawdzenie hasła
		const isPasswordValid = await bcrypt.compare(password, user.password)
		if (!isPasswordValid) {
			return res.status(401).json({
				message: 'Błędne dane logowania',
			})
		}

		// Generowanie JWT tokenu
		const token = jwt.sign(
			{
				id: user.id,
				email: user.email,
				role: user.role,
			},
			process.env.JWT_SECRET,
			{ expiresIn: process.env.JWT_EXPIRE }
		)

		return res.status(200).json({
			message: 'Zalogowano pomyślnie!',
			token,
			user: {
				id: user.id,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				role: user.role,
			},
		})
	} catch (error) {
		console.error(error)
		return res.status(500).json({
			message: 'Błąd podczas logowania',
			error: error.message,
		})
	}
}

// Pobranie profilu użytkownika
exports.getProfile = async (req, res) => {
	try {
		const user = await User.findByPk(req.user.id, {
			attributes: { exclude: ['password'] },
		})

		if (!user) {
			return res.status(404).json({
				message: 'Użytkownik nie znaleziony',
			})
		}

		return res.status(200).json({ user })
	} catch (error) {
		return res.status(500).json({
			message: 'Błąd podczas pobierania profilu',
			error: error.message,
		})
	}
}

// Aktualizacja profilu użytkownika
exports.updateProfile = async (req, res) => {
	try {
		const { firstName, lastName, title, subjects } = req.body

		const user = await User.findByPk(req.user.id)
		if (!user) {
			return res.status(404).json({
				message: 'Użytkownik nie znaleziony',
			})
		}

		await user.update({
			firstName: firstName || user.firstName,
			lastName: lastName || user.lastName,
			title: title || user.title,
			subjects: subjects || user.subjects,
		})

		return res.status(200).json({
			message: 'Profil zaktualizowany!',
			user: {
				id: user.id,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				title: user.title,
				subjects: user.subjects,
			},
		})
	} catch (error) {
		return res.status(500).json({
			message: 'Błąd podczas aktualizacji profilu',
			error: error.message,
		})
	}
}

// Usuwanie konta użytkownika
exports.deleteAccount = async (req, res) => {
	try {
		const user = await User.findByPk(req.user.id)
		if (!user) {
			return res.status(404).json({
				message: 'Użytkownik nie znaleziony',
			})
		}

		await user.destroy()

		return res.status(200).json({
			message: 'Konto usunięte pomyślnie!',
		})
	} catch (error) {
		return res.status(500).json({
			message: 'Błąd podczas usuwania konta',
			error: error.message,
		})
	}
}
