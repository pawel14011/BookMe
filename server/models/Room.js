const { DataTypes } = require('sequelize')

module.exports = sequelize => {
	const Room = sequelize.define(
		'Room',
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				comment: 'np. A101, B205, Lab 3',
			},
			capacity: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 30,
			},
			building: {
				type: DataTypes.STRING,
				allowNull: true,
				comment: 'Budynek, w którym się znajduje sala',
			},
			floor: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
			description: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			isActive: {
				type: DataTypes.BOOLEAN,
				defaultValue: true,
			},
			RoomTypeId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'room_types',
					key: 'id',
				},
			},
		},
		{
			tableName: 'rooms',
			timestamps: true,
		}
	)

	return Room
}
