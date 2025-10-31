const { Sequelize } = require('sequelize')
require('dotenv').config()

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
	host: process.env.DB_HOST,
	dialect: 'mysql',
	logging: false,
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000,
	},
})

// Test połączenia
sequelize
	.authenticate()
	.then(() => console.log('✅ Połączono z bazą danych MySQL'))
	.catch(err => console.error('❌ Błąd połączenia z bazą:', err))

module.exports = sequelize
