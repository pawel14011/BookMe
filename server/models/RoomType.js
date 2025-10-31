const { DataTypes } = require('sequelize')

module.exports = sequelize => {
	const RoomType = sequelize.define(
		'RoomType',
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
				comment: 'np. Sala Wykładowa, Laboratorium, Ćwiczeniownia',
			},
			description: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
		},
		{
			tableName: 'room_types',
			timestamps: true,
		}
	)

	return RoomType
}
