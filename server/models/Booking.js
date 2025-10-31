const { DataTypes } = require('sequelize')

module.exports = sequelize => {
	const Booking = sequelize.define(
		'Booking',
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			startTime: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			endTime: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			notes: {
				type: DataTypes.TEXT,
				allowNull: true,
				comment: 'Notatka o rezerwacji - co będzie się odbywać',
			},
			status: {
				type: DataTypes.ENUM('confirmed', 'cancelled'),
				defaultValue: 'confirmed',
			},
			UserId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'users',
					key: 'id',
				},
			},
			RoomId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'rooms',
					key: 'id',
				},
			},
		},
		{
			tableName: 'bookings',
			timestamps: true,
		}
	)

	return Booking
}
