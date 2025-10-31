import React, { useState, useEffect } from 'react'
import { roomService } from '../services/roomService'

const RoomTypeManager = () => {
	const [roomTypes, setRoomTypes] = useState([])
	const [newType, setNewType] = useState({ name: '', description: '' })
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	useEffect(() => {
		fetchRoomTypes()
	}, [])

	const fetchRoomTypes = async () => {
		try {
			const data = await roomService.getAllRoomTypes()
			setRoomTypes(data.roomTypes)
		} catch (err) {
			setError('Błąd podczas pobierania typów sal')
		}
	}

	const handleCreate = async e => {
		e.preventDefault()
		setLoading(true)
		setError('')

		try {
			await roomService.createRoomType(newType)
			setNewType({ name: '', description: '' })
			fetchRoomTypes()
			alert('Typ sali dodany!')
		} catch (err) {
			setError(err.response?.data?.message || 'Błąd podczas dodawania typu sali')
		} finally {
			setLoading(false)
		}
	}

	const handleDelete = async id => {
		if (!window.confirm('Czy na pewno chcesz usunąć ten typ sali?')) return

		try {
			await roomService.deleteRoomType(id)
			fetchRoomTypes()
			alert('Typ sali usunięty!')
		} catch (err) {
			alert(err.response?.data?.message || 'Błąd podczas usuwania')
		}
	}

	return (
		<div className='bg-white rounded-lg shadow p-6'>
			<h2 className='text-2xl font-bold mb-4'>Typy Sal</h2>

			{error && <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>{error}</div>}

			{/* Formularz dodawania */}
			<form onSubmit={handleCreate} className='mb-6'>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<div>
						<label className='block text-gray-700 text-sm font-bold mb-2'>
							Nazwa typu <span className='text-red-500'>*</span>
						</label>
						<input
							type='text'
							value={newType.name}
							onChange={e => setNewType({ ...newType, name: e.target.value })}
							className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500'
							placeholder='np. Sala Wykładowa'
							required
						/>
					</div>
					<div>
						<label className='block text-gray-700 text-sm font-bold mb-2'>Opis</label>
						<input
							type='text'
							value={newType.description}
							onChange={e => setNewType({ ...newType, description: e.target.value })}
							className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500'
							placeholder='Opcjonalny opis'
						/>
					</div>
				</div>
				<button
					type='submit'
					disabled={loading}
					className='mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50'>
					{loading ? 'Dodawanie...' : 'Dodaj typ sali'}
				</button>
			</form>

			{/* Lista typów sal */}
			<div className='overflow-x-auto'>
				<table className='min-w-full bg-white'>
					<thead className='bg-gray-100'>
						<tr>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>ID</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Nazwa</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Opis</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Akcje</th>
						</tr>
					</thead>
					<tbody className='divide-y divide-gray-200'>
						{roomTypes.map(type => (
							<tr key={type.id}>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>{type.id}</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>{type.name}</td>
								<td className='px-6 py-4 text-sm text-gray-500'>{type.description || '-'}</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm'>
									<button onClick={() => handleDelete(type.id)} className='text-red-600 hover:text-red-900'>
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

export default RoomTypeManager
