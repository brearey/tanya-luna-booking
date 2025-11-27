import { db } from '../config/db'

export const RestaurantTableRepository = {
	getAvailableTable: async (id: number, inDate: Date) => {
		return await db.query('select id from restaurant_table where is_available = true and id = $1 and in_date = $2;', [
			id,
			inDate,
		])
	},
  setAvailableTable: async (id: number, isAvailable: boolean) => {
		return await db.query('update restaurant_table set is_available = $1 where id = $2', [
			isAvailable,
      id
		])
	},
}
