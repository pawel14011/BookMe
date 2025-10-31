const { Room, RoomType } = require('../models')
const { Op } = require('sequelize')

// Pobranie wszystkich typów sal (dla admina i użytkowników)
exports.getAllRoomTypes = async (req, res) => {
	try {
		const roomTypes = await RoomType.findAll()
		return res.status(200).json({ roomTypes })
	} catch (error) {
		return res.status(500).json({
			message: 'Błąd podczas pobierania typów sal',
			error: error.message,
		})
	}
}

// Pobranie wszystkich sal (dla admina)
exports.getAllRooms = async (req, res) => {
	try {
		const rooms = await Room.findAll({
			include: [{ model: RoomType, attributes: ['id', 'name'] }],
			order: [['name', 'ASC']],
		})
		return res.status(200).json({ rooms })
	} catch (error) {
		return res.status(500).json({
			message: 'Błąd podczas pobierania sal',
			error: error.message,
		})
	}
}

// Pobranie sal z filtrowaniem (dla użytkowników)
exports.getAvailableRooms = async (req, res) => {
	try {
		const { roomTypeId } = req.query

		let whereClause = { isActive: true }

		if (roomTypeId) {
			whereClause.RoomTypeId = roomTypeId
		}

		const rooms = await Room.findAll({
			where: whereClause,
			include: [{ model: RoomType, attributes: ['id', 'name'] }],
			order: [['name', 'ASC']],
		})

		return res.status(200).json({ rooms })
	} catch (error) {
		return res.status(500).json({
			message: 'Błąd podczas pobierania dostępnych sal',
			error: error.message,
		})
	}
}

// Pobranie jednej sali
exports.getRoomById = async (req, res) => {
	try {
		const { id } = req.params

		const room = await Room.findByPk(id, {
			include: [{ model: RoomType, attributes: ['id', 'name'] }],
		})

		if (!room) {
			return res.status(404).json({
				message: 'Sala nie znaleziona',
			})
		}

		return res.status(200).json({ room })
	} catch (error) {
		return res.status(500).json({
			message: 'Błąd podczas pobierania sali',
			error: error.message,
		})
	}
}

// Dodanie nowej sali (ADMIN)
exports.createRoom = async (req, res) => {
	try {
		const { name, capacity, building, floor, description, RoomTypeId } = req.body

		// Walidacja
		if (!name || !RoomTypeId) {
			return res.status(400).json({
				message: 'Nazwa sali i typ sali są wymagane',
			})
		}

		// Sprawdzenie czy typ sali istnieje
		const roomType = await RoomType.findByPk(RoomTypeId)
		if (!roomType) {
			return res.status(404).json({
				message: 'Typ sali nie znaleziony',
			})
		}

		// Sprawdzenie czy sala z taką nazwą już istnieje
		const existingRoom = await Room.findOne({ where: { name } })
		if (existingRoom) {
			return res.status(400).json({
				message: 'Sala z taką nazwą już istnieje',
			})
		}

		const room = await Room.create({
			name,
			capacity: capacity || 30,
			building: building || null,
			floor: floor || null,
			description: description || null,
			RoomTypeId,
			isActive: true,
		})

		return res.status(201).json({
			message: 'Sala dodana pomyślnie!',
			room,
		})
	} catch (error) {
		return res.status(500).json({
			message: 'Błąd podczas dodawania sali',
			error: error.message,
		})
	}
}

// Aktualizacja nazwy sali (ADMIN)
exports.updateRoomName = async (req, res) => {
	try {
		const { id } = req.params
		const { name } = req.body

		if (!name) {
			return res.status(400).json({
				message: 'Nazwa sali jest wymagana',
			})
		}

		const room = await Room.findByPk(id)
		if (!room) {
			return res.status(404).json({
				message: 'Sala nie znaleziona',
			})
		}

		// Sprawdzenie czy nowa nazwa już istnieje
		const existingRoom = await Room.findOne({
			where: { name, id: { [Op.ne]: id } },
		})
		if (existingRoom) {
			return res.status(400).json({
				message: 'Sala z taką nazwą już istnieje',
			})
		}

		await room.update({ name })

		return res.status(200).json({
			message: 'Nazwa sali zaktualizowana!',
			room,
		})
	} catch (error) {
		return res.status(500).json({
			message: 'Błąd podczas aktualizacji sali',
			error: error.message,
		})
	}
}

// Aktualizacja szczegółów sali (ADMIN)
exports.updateRoom = async (req, res) => {
	try {
		const { id } = req.params
		const { name, capacity, building, floor, description, RoomTypeId, isActive } = req.body

		const room = await Room.findByPk(id)
		if (!room) {
			return res.status(404).json({
				message: 'Sala nie znaleziona',
			})
		}

		// Jeśli zmieniana nazwa - sprawdzić czy już istnieje
		if (name && name !== room.name) {
			const existingRoom = await Room.findOne({
				where: { name, id: { [Op.ne]: id } },
			})
			if (existingRoom) {
				return res.status(400).json({
					message: 'Sala z taką nazwą już istnieje',
				})
			}
		}

		await room.update({
			name: name || room.name,
			capacity: capacity !== undefined ? capacity : room.capacity,
			building: building !== undefined ? building : room.building,
			floor: floor !== undefined ? floor : room.floor,
			description: description !== undefined ? description : room.description,
			RoomTypeId: RoomTypeId || room.RoomTypeId,
			isActive: isActive !== undefined ? isActive : room.isActive,
		})

		return res.status(200).json({
			message: 'Sala zaktualizowana!',
			room,
		})
	} catch (error) {
		return res.status(500).json({
			message: 'Błąd podczas aktualizacji sali',
			error: error.message,
		})
	}
}

// Usunięcie sali (ADMIN)
exports.deleteRoom = async (req, res) => {
	try {
		const { id } = req.params

		const room = await Room.findByPk(id)
		if (!room) {
			return res.status(404).json({
				message: 'Sala nie znaleziona',
			})
		}

		await room.destroy()

		return res.status(200).json({
			message: 'Sala usunięta pomyślnie!',
		})
	} catch (error) {
		return res.status(500).json({
			message: 'Błąd podczas usuwania sali',
			error: error.message,
		})
	}
}

// Dodanie nowego typu sali (ADMIN)
exports.createRoomType = async (req, res) => {
	try {
		const { name, description } = req.body

		if (!name) {
			return res.status(400).json({
				message: 'Nazwa typu sali jest wymagana',
			})
		}

		const existingType = await RoomType.findOne({ where: { name } })
		if (existingType) {
			return res.status(400).json({
				message: 'Typ sali z taką nazwą już istnieje',
			})
		}

		const roomType = await RoomType.create({
			name,
			description: description || null,
		})

		return res.status(201).json({
			message: 'Typ sali dodany pomyślnie!',
			roomType,
		})
	} catch (error) {
		return res.status(500).json({
			message: 'Błąd podczas dodawania typu sali',
			error: error.message,
		})
	}
}

// Usunięcie typu sali (ADMIN)
exports.deleteRoomType = async (req, res) => {
	try {
		const { id } = req.params

		const roomType = await RoomType.findByPk(id)
		if (!roomType) {
			return res.status(404).json({
				message: 'Typ sali nie znaleziony',
			})
		}

		// Sprawdzenie czy jakieś sale mają ten typ
		const roomsWithType = await Room.count({ where: { RoomTypeId: id } })
		if (roomsWithType > 0) {
			return res.status(400).json({
				message: 'Nie można usunąć typu sali - przypisane są do niego sale',
			})
		}

		await roomType.destroy()

		return res.status(200).json({
			message: 'Typ sali usunięty pomyślnie!',
		})
	} catch (error) {
		return res.status(500).json({
			message: 'Błąd podczas usuwania typu sali',
			error: error.message,
		})
	}
}
