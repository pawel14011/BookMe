const moment = require('moment')

const createSampleBookings = async (User, Room, Booking) => {
	try {
		// Sprawdź czy rezerwacje już istnieją
		const existingBookings = await Booking.count()
		if (existingBookings > 0) {
			console.log('ℹ️  Przykładowe rezerwacje już istnieją')
			return
		}

		console.log('📦 Tworzenie przykładowych rezerwacji...')

		// Pobierz admina i sale
		const admin = await User.findOne({ where: { email: 'admin@system.pl' } })

		if (!admin) {
			console.log('⚠️  Brak użytkownika do utworzenia rezerwacji')
			return
		}

		const rooms = await Room.findAll({ limit: 6 })

		if (rooms.length === 0) {
			console.log('⚠️  Brak sal do utworzenia rezerwacji')
			return
		}

		// Dzisiejsza data
		const today = moment().startOf('day')

		// Przykładowe rezerwacje
		const bookings = [
			// Rezerwacje z przeszłości (zakończone)
			{
				RoomId: rooms[0].id,
				UserId: admin.id,
				startTime: moment(today).subtract(7, 'days').set({ hour: 8, minute: 0 }).toDate(),
				endTime: moment(today).subtract(7, 'days').set({ hour: 10, minute: 0 }).toDate(),
				notes: 'Wykład wprowadzający do matematyki dyskretnej',
				status: 'confirmed',
			},
			{
				RoomId: rooms[1].id,
				UserId: admin.id,
				startTime: moment(today).subtract(5, 'days').set({ hour: 12, minute: 0 }).toDate(),
				endTime: moment(today).subtract(5, 'days').set({ hour: 14, minute: 0 }).toDate(),
				notes: 'Laboratorium programowania w C++',
				status: 'confirmed',
			},
			{
				RoomId: rooms[2].id,
				UserId: admin.id,
				startTime: moment(today).subtract(3, 'days').set({ hour: 10, minute: 0 }).toDate(),
				endTime: moment(today).subtract(3, 'days').set({ hour: 12, minute: 0 }).toDate(),
				notes: 'Ćwiczenia z algorytmów i struktur danych',
				status: 'cancelled',
			},

			// Rezerwacja dzisiejsza (w trakcie lub zaplanowana na dziś)
			{
				RoomId: rooms[0].id,
				UserId: admin.id,
				startTime: moment(today).set({ hour: 14, minute: 0 }).toDate(),
				endTime: moment(today).set({ hour: 16, minute: 0 }).toDate(),
				notes: 'Wykład z baz danych - normalizacja i projektowanie',
				status: 'confirmed',
			},

			// Nadchodzące rezerwacje (przyszłość)
			{
				RoomId: rooms[3].id,
				UserId: admin.id,
				startTime: moment(today).add(1, 'days').set({ hour: 9, minute: 0 }).toDate(),
				endTime: moment(today).add(1, 'days').set({ hour: 11, minute: 0 }).toDate(),
				notes: 'Laboratorium sieci komputerowych',
				status: 'confirmed',
			},
			{
				RoomId: rooms[1].id,
				UserId: admin.id,
				startTime: moment(today).add(2, 'days').set({ hour: 10, minute: 0 }).toDate(),
				endTime: moment(today).add(2, 'days').set({ hour: 12, minute: 0 }).toDate(),
				notes: 'Wykład z systemów operacyjnych',
				status: 'confirmed',
			},
			{
				RoomId: rooms[4].id,
				UserId: admin.id,
				startTime: moment(today).add(3, 'days').set({ hour: 13, minute: 0 }).toDate(),
				endTime: moment(today).add(3, 'days').set({ hour: 15, minute: 0 }).toDate(),
				notes: 'Ćwiczenia z inżynierii oprogramowania',
				status: 'confirmed',
			},
			{
				RoomId: rooms[2].id,
				UserId: admin.id,
				startTime: moment(today).add(4, 'days').set({ hour: 8, minute: 0 }).toDate(),
				endTime: moment(today).add(4, 'days').set({ hour: 10, minute: 0 }).toDate(),
				notes: 'Laboratorium sztucznej inteligencji',
				status: 'confirmed',
			},
			{
				RoomId: rooms[5].id,
				UserId: admin.id,
				startTime: moment(today).add(5, 'days').set({ hour: 11, minute: 0 }).toDate(),
				endTime: moment(today).add(5, 'days').set({ hour: 13, minute: 0 }).toDate(),
				notes: 'Wykład z cyberbezpieczeństwa',
				status: 'confirmed',
			},
			{
				RoomId: rooms[0].id,
				UserId: admin.id,
				startTime: moment(today).add(7, 'days').set({ hour: 9, minute: 0 }).toDate(),
				endTime: moment(today).add(7, 'days').set({ hour: 11, minute: 0 }).toDate(),
				notes: 'Kolokwium z matematyki dyskretnej',
				status: 'confirmed',
			},
			{
				RoomId: rooms[3].id,
				UserId: admin.id,
				startTime: moment(today).add(10, 'days').set({ hour: 14, minute: 0 }).toDate(),
				endTime: moment(today).add(10, 'days').set({ hour: 16, minute: 0 }).toDate(),
				notes: 'Konsultacje projektowe',
				status: 'confirmed',
			},
			{
				RoomId: rooms[1].id,
				UserId: admin.id,
				startTime: moment(today).add(14, 'days').set({ hour: 10, minute: 0 }).toDate(),
				endTime: moment(today).add(14, 'days').set({ hour: 12, minute: 0 }).toDate(),
				notes: 'Egzamin końcowy - programowanie obiektowe',
				status: 'confirmed',
			},
		]

		// Utwórz rezerwacje
		await Booking.bulkCreate(bookings)

		console.log(`✅ Utworzono przykładowe rezerwacje (${bookings.length})`)
		console.log(`   - ${bookings.filter(b => moment(b.endTime).isBefore(moment())).length} zakończonych`)
		console.log(
			`   - ${
				bookings.filter(b => moment(b.startTime).isSameOrBefore(moment()) && moment(b.endTime).isAfter(moment())).length
			} w trakcie/dzisiaj`
		)
		console.log(`   - ${bookings.filter(b => moment(b.startTime).isAfter(moment())).length} nadchodzących`)
		console.log(`   - ${bookings.filter(b => b.status === 'cancelled').length} anulowanych`)
	} catch (error) {
		console.error('❌ Błąd podczas tworzenia przykładowych rezerwacji:', error)
	}
}

module.exports = createSampleBookings
