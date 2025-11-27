import { db } from '../config/db'

export const BookingRepository = {
	createBooking: async (restaurant_id: number, guest_count: number, restaurant_table_id: number) => {
		return await db.query(
			"insert into booking (restaurant_id, guest_count, restaurant_table_id, booking_status) VALUES ($1,$2,$3, 'CREATED') RETURNING id, restaurant_table_id;",
			[restaurant_id, guest_count, restaurant_table_id]
		)
	},
}
