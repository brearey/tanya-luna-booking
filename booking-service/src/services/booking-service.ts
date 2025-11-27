import { BookingRepository } from '../repo/booking-repo'
import { RestaurantTableRepository } from '../repo/restaurant-table-repo'
import { BookingStatus } from '../types/app-types'

export const BookingService = {
	checkingAvailable: async (restaurantTableId: number, inDate: Date): Promise<boolean> => {
		const res = await RestaurantTableRepository.getAvailableTable(restaurantTableId, inDate)
		return res?.rows[0]?.id ? true : false
	},

	approveBooking: async (id: number, restaurantTableId: number) => {
		await BookingRepository.updateStatus(id, BookingStatus.CONFIRMED)
    await RestaurantTableRepository.setAvailableTable(restaurantTableId, false)
	},

	rejectBooking: async (id: number) => {
		await BookingRepository.updateStatus(id, BookingStatus.REJECTED)
	},
}
