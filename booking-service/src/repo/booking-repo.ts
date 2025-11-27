import { db } from '../config/db'
import { BookingStatus } from '../types/app-types'

export const BookingRepository = {
	updateStatus: async (id: number, status: BookingStatus) => {
		await db.query(`UPDATE booking SET booking_status = $1 WHERE id = $2`, [status, id])
	},

	getById: async (id: number) => {
		const res = await db.query(`SELECT * FROM booking WHERE id = $1`, [id])
		return res.rows[0]
	},
}
