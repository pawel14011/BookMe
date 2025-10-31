const { DataTypes } = require('sequelize')

module.exports = sequelize => {
	const User = sequelize.define(
		'User',
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				validate: { isEmail: true },
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			firstName: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			lastName: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			title: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			subjects: {
				type: DataTypes.TEXT,
				allowNull: true,
				comment: 'Przedmioty lub zajęcia prowadzone',
			},
			role: {
				type: DataTypes.ENUM('user', 'admin'),
				defaultValue: 'user',
			},
			createdAt: {
				type: DataTypes.DATE,
				defaultValue: DataTypes.NOW,
			},
			updatedAt: {
				type: DataTypes.DATE,
				defaultValue: DataTypes.NOW,
			},
		},
		{
			tableName: 'users',
			timestamps: true,
		}
	)

	return User
}
