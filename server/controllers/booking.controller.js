const { Booking, Room, User, RoomType } = require('../models')
const { Op } = require('sequelize')

// Pobranie wszystkich rezerwacji użytkownika
exports.getUserBookings = async (req, res) => {
	try {
		const userId = req.user.id

		const bookings = await Booking.findAll({
			where: { UserId: userId },
			include: [
				{
					model: Room,
					attributes: ['id', 'name', 'capacity', 'building', 'floor'],
					include: [{ model: RoomType, attributes: ['id', 'name'] }],
				},
				{
					model: User,
					attributes: ['id', 'email', 'firstName', 'lastName'],
				},
			],
			order: [['startTime', 'ASC']],
		})

		return res.status(200).json({ bookings })
	} catch (error) {
		return res.status(500).json({
			message: 'Błąd podczas pobierania rezerwacji',
			error: error.message,
		})
	}
}

// Pobranie wszystkich rezerwacji (ADMIN)
exports.getAllBookings = async (req, res) => {
	try {
		const bookings = await Booking.findAll({
			include: [
				{
					model: Room,
					attributes: ['id', 'name', 'capacity', 'building', 'floor'],
					include: [{ model: RoomType, attributes: ['id', 'name'] }],
				},
				{
					model: User,
					attributes: ['id', 'email', 'firstName', 'lastName'],
				},
			],
			order: [['startTime', 'ASC']],
		})

		return res.status(200).json({ bookings })
	} catch (error) {
		return res.status(500).json({
			message: 'Błąd podczas pobierania rezerwacji',
			error: error.message,
		})
	}
}

// Pobranie rezerwacji dla konkretnej sali w danym przedziale czasowym
exports.getRoomBookings = async (req, res) => {
	try {
		const { roomId, startDate, endDate } = req.query

		if (!roomId || !startDate || !endDate) {
			return res.status(400).json({
				message: 'RoomId, startDate i endDate są wymagane',
			})
		}

		const room = await Room.findByPk(roomId)
		if (!room) {
			return res.status(404).json({
				message: 'Sala nie znaleziona',
			})
		}

		const bookings = await Booking.findAll({
			where: {
				RoomId: roomId,
				status: 'confirmed',
				[Op.or]: [
					{
						startTime: {
							[Op.between]: [new Date(startDate), new Date(endDate)],
						},
					},
					{
						endTime: {
							[Op.between]: [new Date(startDate), new Date(endDate)],
						},
					},
					{
						[Op.and]: [{ startTime: { [Op.lte]: new Date(startDate) } }, { endTime: { [Op.gte]: new Date(endDate) } }],
					},
				],
			},
			include: [
				{
					model: User,
					attributes: ['id', 'email', 'firstName', 'lastName'],
				},
			],
			order: [['startTime', 'ASC']],
		})

		return res.status(200).json({ bookings })
	} catch (error) {
		return res.status(500).json({
			message: 'Błąd podczas pobierania rezerwacji sali',
			error: error.message,
		})
	}
}

// Sprawdzenie dostępności sali w danym terminie
exports.checkRoomAvailability = async (req, res) => {
	try {
		const { roomId, startTime, endTime } = req.body

		if (!roomId || !startTime || !endTime) {
			return res.status(400).json({
				message: 'RoomId, startTime i endTime są wymagane',
			})
		}

		const room = await Room.findByPk(roomId)
		if (!room) {
			return res.status(404).json({
				message: 'Sala nie znaleziona',
			})
		}

		const start = new Date(startTime)
		const end = new Date(endTime)

		if (start >= end) {
			return res.status(400).json({
				message: 'Czas rozpoczęcia musi być przed czasem zakończenia',
			})
		}

		// Sprawdzenie czy jest konflikt z istniejącymi rezerwacjami
		const conflict = await Booking.findOne({
			where: {
				RoomId: roomId,
				status: 'confirmed',
				[Op.or]: [
					{
						startTime: { [Op.lt]: end },
						endTime: { [Op.gt]: start },
					},
				],
			},
		})

		if (conflict) {
			return res.status(200).json({
				available: false,
				message: 'Sala jest zajęta w tym terminie',
			})
		}

		return res.status(200).json({
			available: true,
			message: 'Sala jest dostępna',
		})
	} catch (error) {
		return res.status(500).json({
			message: 'Błąd podczas sprawdzania dostępności',
			error: error.message,
		})
	}
}

// Rezerwacja sali
exports.createBooking = async (req, res) => {
	try {
		const { roomId, startTime, endTime, notes } = req.body
		const userId = req.user.id

		// Walidacja
		if (!roomId || !startTime || !endTime) {
			return res.status(400).json({
				message: 'RoomId, startTime i endTime są wymagane',
			})
		}

		const start = new Date(startTime)
		const end = new Date(endTime)

		if (start >= end) {
			return res.status(400).json({
				message: 'Czas rozpoczęcia musi być przed czasem zakończenia',
			})
		}

		// Sprawdzenie czy sala istnieje
		const room = await Room.findByPk(roomId)
		if (!room) {
			return res.status(404).json({
				message: 'Sala nie znaleziona',
			})
		}

		if (!room.isActive) {
			return res.status(400).json({
				message: 'Sala jest nieaktywna',
			})
		}

		// Sprawdzenie konfliktów
		const conflict = await Booking.findOne({
			where: {
				RoomId: roomId,
				status: 'confirmed',
				[Op.or]: [
					{
						startTime: { [Op.lt]: end },
						endTime: { [Op.gt]: start },
					},
				],
			},
		})

		if (conflict) {
			return res.status(400).json({
				message: 'Sala jest już zarezerwowana w tym terminie',
			})
		}

		// Tworzenie rezerwacji
		const booking = await Booking.create({
			RoomId: roomId,
			UserId: userId,
			startTime: start,
			endTime: end,
			notes: notes || null,
			status: 'confirmed',
		})

		// Pobranie pełnych danych rezerwacji
		const fullBooking = await Booking.findByPk(booking.id, {
			include: [
				{
					model: Room,
					attributes: ['id', 'name', 'capacity', 'building', 'floor'],
					include: [{ model: RoomType, attributes: ['id', 'name'] }],
				},
				{
					model: User,
					attributes: ['id', 'email', 'firstName', 'lastName'],
				},
			],
		})

		return res.status(201).json({
			message: 'Rezerwacja utworzona pomyślnie!',
			booking: fullBooking,
		})
	} catch (error) {
		return res.status(500).json({
			message: 'Błąd podczas tworzenia rezerwacji',
			error: error.message,
		})
	}
}

// Zmiana terminu rezerwacji
exports.updateBooking = async (req, res) => {
	try {
		const { id } = req.params
		const { startTime, endTime, notes } = req.body
		const userId = req.user.id

		const booking = await Booking.findByPk(id)
		if (!booking) {
			return res.status(404).json({
				message: 'Rezerwacja nie znaleziona',
			})
		}

		// Sprawdzenie czy użytkownik jest właścicielem rezerwacji lub adminem
		if (booking.UserId !== userId && req.user.role !== 'admin') {
			return res.status(403).json({
				message: 'Nie masz uprawnień do modyfikacji tej rezerwacji',
			})
		}

		const start = new Date(startTime || booking.startTime)
		const end = new Date(endTime || booking.endTime)

		if (start >= end) {
			return res.status(400).json({
				message: 'Czas rozpoczęcia musi być przed czasem zakończenia',
			})
		}

		// Sprawdzenie konfliktów (pomijając tę rezerwację)
		const conflict = await Booking.findOne({
			where: {
				RoomId: booking.RoomId,
				status: 'confirmed',
				id: { [Op.ne]: id },
				[Op.or]: [
					{
						startTime: { [Op.lt]: end },
						endTime: { [Op.gt]: start },
					},
				],
			},
		})

		if (conflict) {
			return res.status(400).json({
				message: 'Nowy termin koliduje z inną rezerwacją',
			})
		}

		// Aktualizacja rezerwacji
		await booking.update({
			startTime: start,
			endTime: end,
			notes: notes !== undefined ? notes : booking.notes,
		})

		const updatedBooking = await Booking.findByPk(id, {
			include: [
				{
					model: Room,
					attributes: ['id', 'name', 'capacity', 'building', 'floor'],
					include: [{ model: RoomType, attributes: ['id', 'name'] }],
				},
				{
					model: User,
					attributes: ['id', 'email', 'firstName', 'lastName'],
				},
			],
		})

		return res.status(200).json({
			message: 'Rezerwacja zaktualizowana!',
			booking: updatedBooking,
		})
	} catch (error) {
		return res.status(500).json({
			message: 'Błąd podczas aktualizacji rezerwacji',
			error: error.message,
		})
	}
}

// Anulowanie rezerwacji
exports.cancelBooking = async (req, res) => {
	try {
		const { id } = req.params
		const userId = req.user.id

		const booking = await Booking.findByPk(id)
		if (!booking) {
			return res.status(404).json({
				message: 'Rezerwacja nie znaleziona',
			})
		}

		// Sprawdzenie czy użytkownik jest właścicielem rezerwacji lub adminem
		if (booking.UserId !== userId && req.user.role !== 'admin') {
			return res.status(403).json({
				message: 'Nie masz uprawnień do anulowania tej rezerwacji',
			})
		}

		await booking.update({ status: 'cancelled' })

		return res.status(200).json({
			message: 'Rezerwacja anulowana!',
		})
	} catch (error) {
		return res.status(500).json({
			message: 'Błąd podczas anulowania rezerwacji',
			error: error.message,
		})
	}
}

// Usunięcie rezerwacji (ADMIN)
exports.deleteBooking = async (req, res) => {
	try {
		const { id } = req.params

		const booking = await Booking.findByPk(id)
		if (!booking) {
			return res.status(404).json({
				message: 'Rezerwacja nie znaleziona',
			})
		}

		await booking.destroy()

		return res.status(200).json({
			message: 'Rezerwacja usunięta!',
		})
	} catch (error) {
		return res.status(500).json({
			message: 'Błąd podczas usuwania rezerwacji',
			error: error.message,
		})
	}
}

// Pobranie rezerwacji dla konkretnego użytkownika (ADMIN)
exports.getUserBookingsByAdmin = async (req, res) => {
	try {
		const { userId } = req.params

		const user = await User.findByPk(userId)
		if (!user) {
			return res.status(404).json({
				message: 'Użytkownik nie znaleziony',
			})
		}

		const bookings = await Booking.findAll({
			where: { UserId: userId },
			include: [
				{
					model: Room,
					attributes: ['id', 'name', 'capacity', 'building', 'floor'],
					include: [{ model: RoomType, attributes: ['id', 'name'] }],
				},
			],
			order: [['startTime', 'ASC']],
		})

		return res.status(200).json({ bookings })
	} catch (error) {
		return res.status(500).json({
			message: 'Błąd podczas pobierania rezerwacji użytkownika',
			error: error.message,
		})
	}
}
