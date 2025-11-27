import { BookingRepository } from '../repo/booking-repo'
import { BookingStatus } from '../types/app-types'

export const BookingService = {
	createBooking: async (name: string, date: string) => {
		return await BookingRepository.create(name, date)
	},

	approveBooking: async (id: number) => {
		await BookingRepository.updateStatus(id, BookingStatus.CONFIRMED)
	},

	rejectBooking: async (id: number) => {
		await BookingRepository.updateStatus(id, BookingStatus.REJECTED)
	},
}
