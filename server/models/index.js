const sequelize = require('../config/database')
const { DataTypes } = require('sequelize')

// Import modeli
const User = require('./User')(sequelize)
const RoomType = require('./RoomType')(sequelize)
const Room = require('./Room')(sequelize)
const Booking = require('./Booking')(sequelize)

// Definiowanie relacji[1][22][25]
// User - Booking (jeden do wielu)
User.hasMany(Booking, {
	foreignKey: 'UserId',
	onDelete: 'CASCADE',
})
Booking.belongsTo(User)

// Room - Booking (jeden do wielu)
Room.hasMany(Booking, {
	foreignKey: 'RoomId',
	onDelete: 'CASCADE',
})
Booking.belongsTo(Room)

// RoomType - Room (jeden do wielu)
RoomType.hasMany(Room, {
	foreignKey: 'RoomTypeId',
	onDelete: 'CASCADE',
})
Room.belongsTo(RoomType)

// Sync bazy danych
const syncDatabase = async () => {
	try {
		await sequelize.sync({ alter: true })
		console.log('✅ Modele zsynchronizowane z bazą danych')
	} catch (error) {
		console.error('❌ Błąd synchronizacji:', error)
	}
}

module.exports = {
	sequelize,
	User,
	RoomType,
	Room,
	Booking,
	syncDatabase,
}
