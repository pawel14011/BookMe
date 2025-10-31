const createSampleData = async (RoomType, Room) => {
	try {
		// Sprawdź czy dane już istnieją
		const existingTypes = await RoomType.count()
		if (existingTypes > 0) {
			console.log('ℹ️  Przykładowe dane już istnieją')
			return
		}

		console.log('📦 Tworzenie przykładowych danych...')

		// Typy sal
		const salaWykladowa = await RoomType.create({
			name: 'Sala Wykładowa',
			description: 'Duża sala do wykładów z projektorem i nagłośnieniem',
		})

		const laboratorium = await RoomType.create({
			name: 'Laboratorium',
			description: 'Sala wyposażona w stanowiska komputerowe',
		})

		const cwiczeniownia = await RoomType.create({
			name: 'Ćwiczeniownia',
			description: 'Sala do zajęć w mniejszych grupach',
		})

		// Sale
		await Room.bulkCreate([
			// Sale wykładowe
			{
				name: 'A101',
				capacity: 100,
				building: 'Budynek A',
				floor: 1,
				description: 'Duża sala wykładowa z projektorem i tablicą interaktywną',
				RoomTypeId: salaWykladowa.id,
				isActive: true,
			},
			{
				name: 'A201',
				capacity: 80,
				building: 'Budynek A',
				floor: 2,
				description: 'Sala wykładowa z klimatyzacją',
				RoomTypeId: salaWykladowa.id,
				isActive: true,
			},
			{
				name: 'B105',
				capacity: 120,
				building: 'Budynek B',
				floor: 1,
				description: 'Największa sala wykładowa',
				RoomTypeId: salaWykladowa.id,
				isActive: true,
			},

			// Laboratoria
			{
				name: 'Lab 1',
				capacity: 30,
				building: 'Budynek C',
				floor: 1,
				description: 'Laboratorium komputerowe - 30 stanowisk',
				RoomTypeId: laboratorium.id,
				isActive: true,
			},
			{
				name: 'Lab 2',
				capacity: 25,
				building: 'Budynek C',
				floor: 2,
				description: 'Laboratorium komputerowe - 25 stanowisk',
				RoomTypeId: laboratorium.id,
				isActive: true,
			},
			{
				name: 'Lab 3',
				capacity: 20,
				building: 'Budynek C',
				floor: 3,
				description: 'Laboratorium specjalistyczne',
				RoomTypeId: laboratorium.id,
				isActive: true,
			},

			// Ćwiczeniownie
			{
				name: 'C101',
				capacity: 30,
				building: 'Budynek C',
				floor: 1,
				description: 'Sala do zajęć ćwiczeniowych',
				RoomTypeId: cwiczeniownia.id,
				isActive: true,
			},
			{
				name: 'C102',
				capacity: 25,
				building: 'Budynek C',
				floor: 1,
				description: 'Sala do zajęć ćwiczeniowych',
				RoomTypeId: cwiczeniownia.id,
				isActive: true,
			},
			{
				name: 'D201',
				capacity: 35,
				building: 'Budynek D',
				floor: 2,
				description: 'Sala ćwiczeniowa z tablicą interaktywną',
				RoomTypeId: cwiczeniownia.id,
				isActive: true,
			},
		])

		console.log('✅ Utworzono przykładowe typy sal (3)')
		console.log('✅ Utworzono przykładowe sale (9)')
	} catch (error) {
		console.error('❌ Błąd podczas tworzenia przykładowych danych:', error)
	}
}

module.exports = createSampleData
