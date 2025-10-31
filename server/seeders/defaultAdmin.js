const bcrypt = require('bcryptjs')

const createDefaultAdmin = async User => {
	try {
		// Sprawdź czy admin już istnieje
		const existingAdmin = await User.findOne({
			where: { email: 'admin@system.pl' },
		})

		if (existingAdmin) {
			console.log('ℹ️  Domyślny administrator już istnieje')
			return
		}

		// Utwórz domyślnego admina
		const hashedPassword = await bcrypt.hash('admin123', 10)

		await User.create({
			email: 'admin@system.pl',
			password: hashedPassword,
			firstName: 'Administrator',
			lastName: 'Systemu',
			title: 'Admin',
			subjects: 'Zarządzanie systemem',
			role: 'admin',
		})

		console.log('✅ Utworzono domyślnego administratora')
		console.log('📧 Email: admin@system.pl')
		console.log('🔑 Hasło: admin123')
		console.log('⚠️  UWAGA: Zmień hasło po pierwszym logowaniu!')
	} catch (error) {
		console.error('❌ Błąd podczas tworzenia domyślnego administratora:', error)
	}
}

module.exports = createDefaultAdmin
