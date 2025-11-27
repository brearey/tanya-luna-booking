import { db } from '../config/db'
import { BookingStatus } from '../types/app-types'

export const BookingRepository = {
  create: async (name: string, date: string) => {
    const result = await db.query(
      `INSERT INTO booking(name, date, booking_status)
       VALUES($1, $2, $3) RETURNING *`,
      [name, date, BookingStatus.CREATED]
    )
    return result.rows[0]
  },

  updateStatus: async (id: number, status: BookingStatus) => {
    await db.query(
      `UPDATE booking SET booking_status = $1 WHERE id = $2`,
      [status, id]
    )
  },

  getById: async (id: number) => {
    const res = await db.query(`SELECT * FROM booking WHERE id = $1`, [id])
    return res.rows[0]
  }
}
