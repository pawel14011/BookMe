import React, { useState, useEffect } from 'react'
import { roomService } from '../services/roomService'

const RoomManager = () => {
	const [rooms, setRooms] = useState([])
	const [roomTypes, setRoomTypes] = useState([])
	const [showForm, setShowForm] = useState(false)
	const [editingRoom, setEditingRoom] = useState(null)
	const [formData, setFormData] = useState({
		name: '',
		capacity: 30,
		building: '',
		floor: '',
		description: '',
		RoomTypeId: '',
	})
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	useEffect(() => {
		fetchRooms()
		fetchRoomTypes()
	}, [])

	const fetchRooms = async () => {
		try {
			const data = await roomService.getAllRooms()
			setRooms(data.rooms)
		} catch (err) {
			setError('Błąd podczas pobierania sal')
		}
	}

	const fetchRoomTypes = async () => {
		try {
			const data = await roomService.getAllRoomTypes()
			setRoomTypes(data.roomTypes)
		} catch (err) {
			console.error('Błąd podczas pobierania typów sal')
		}
	}

	const resetForm = () => {
		setFormData({
			name: '',
			capacity: 30,
			building: '',
			floor: '',
			description: '',
			RoomTypeId: '',
		})
		setEditingRoom(null)
		setShowForm(false)
	}

	const handleEdit = room => {
		setEditingRoom(room.id)
		setFormData({
			name: room.name,
			capacity: room.capacity,
			building: room.building || '',
			floor: room.floor || '',
			description: room.description || '',
			RoomTypeId: room.RoomTypeId,
		})
		setShowForm(true)
	}

	const handleSubmit = async e => {
		e.preventDefault()
		setLoading(true)
		setError('')

		try {
			if (editingRoom) {
				await roomService.updateRoom(editingRoom, formData)
				alert('Sala zaktualizowana!')
			} else {
				await roomService.createRoom(formData)
				alert('Sala dodana!')
			}
			resetForm()
			fetchRooms()
		} catch (err) {
			setError(err.response?.data?.message || 'Błąd podczas zapisywania sali')
		} finally {
			setLoading(false)
		}
	}

	const handleDelete = async id => {
		if (!window.confirm('Czy na pewno chcesz usunąć tę salę?')) return

		try {
			await roomService.deleteRoom(id)
			fetchRooms()
			alert('Sala usunięta!')
		} catch (err) {
			alert(err.response?.data?.message || 'Błąd podczas usuwania')
		}
	}

	return (
		<div className='bg-white rounded-lg shadow p-6'>
			<div className='flex justify-between items-center mb-4'>
				<h2 className='text-2xl font-bold'>Zarządzanie Salami</h2>
				<button
					onClick={() => setShowForm(!showForm)}
					className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'>
					{showForm ? 'Anuluj' : 'Dodaj salę'}
				</button>
			</div>

			{error && <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>{error}</div>}

			{/* Formularz dodawania/edycji */}
			{showForm && (
				<form onSubmit={handleSubmit} className='mb-6 p-4 bg-gray-50 rounded'>
					<h3 className='text-lg font-semibold mb-4'>{editingRoom ? 'Edytuj salę' : 'Dodaj nową salę'}</h3>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div>
							<label className='block text-gray-700 text-sm font-bold mb-2'>
								Nazwa sali <span className='text-red-500'>*</span>
							</label>
							<input
								type='text'
								value={formData.name}
								onChange={e => setFormData({ ...formData, name: e.target.value })}
								className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500'
								placeholder='A101'
								required
							/>
						</div>

						<div>
							<label className='block text-gray-700 text-sm font-bold mb-2'>
								Typ sali <span className='text-red-500'>*</span>
							</label>
							<select
								value={formData.RoomTypeId}
								onChange={e => setFormData({ ...formData, RoomTypeId: e.target.value })}
								className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500'
								required>
								<option value=''>Wybierz typ</option>
								{roomTypes.map(type => (
									<option key={type.id} value={type.id}>
										{type.name}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className='block text-gray-700 text-sm font-bold mb-2'>Pojemność</label>
							<input
								type='number'
								value={formData.capacity}
								onChange={e => setFormData({ ...formData, capacity: e.target.value })}
								className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500'
								min='1'
							/>
						</div>

						<div>
							<label className='block text-gray-700 text-sm font-bold mb-2'>Budynek</label>
							<input
								type='text'
								value={formData.building}
								onChange={e => setFormData({ ...formData, building: e.target.value })}
								className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500'
								placeholder='Budynek A'
							/>
						</div>

						<div>
							<label className='block text-gray-700 text-sm font-bold mb-2'>Piętro</label>
							<input
								type='number'
								value={formData.floor}
								onChange={e => setFormData({ ...formData, floor: e.target.value })}
								className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500'
							/>
						</div>

						<div className='md:col-span-2'>
							<label className='block text-gray-700 text-sm font-bold mb-2'>Opis</label>
							<textarea
								value={formData.description}
								onChange={e => setFormData({ ...formData, description: e.target.value })}
								className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500'
								rows='3'
								placeholder='Dodatkowe informacje o sali'
							/>
						</div>
					</div>

					<div className='flex gap-2 mt-4'>
						<button
							type='submit'
							disabled={loading}
							className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50'>
							{loading ? 'Zapisywanie...' : editingRoom ? 'Zapisz zmiany' : 'Dodaj salę'}
						</button>
						<button
							type='button'
							onClick={resetForm}
							className='bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded'>
							Anuluj
						</button>
					</div>
				</form>
			)}

			{/* Lista sal */}
			<div className='overflow-x-auto'>
				<table className='min-w-full bg-white'>
					<thead className='bg-gray-100'>
						<tr>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Nazwa</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Typ</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								Pojemność
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								Budynek
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Piętro</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Akcje</th>
						</tr>
					</thead>
					<tbody className='divide-y divide-gray-200'>
						{rooms.map(room => (
							<tr key={room.id}>
								<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>{room.name}</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{room.RoomType?.name}</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{room.capacity}</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{room.building || '-'}</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{room.floor || '-'}</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm space-x-2'>
									<button onClick={() => handleEdit(room)} className='text-blue-600 hover:text-blue-900'>
										Edytuj
									</button>
									<button onClick={() => handleDelete(room.id)} className='text-red-600 hover:text-red-900'>
										Usuń
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default RoomManager
