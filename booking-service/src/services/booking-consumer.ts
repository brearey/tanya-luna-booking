import { kafka } from '../config/kafka'
import { ENV } from '../config/env'
import { BookingService } from './booking-service'
import { logger } from '../utils/logger'

export const startConsumer = async () => {
	const consumer = kafka.consumer({ groupId: 'booking_group' })
	await consumer.connect()
	await consumer.subscribe({ topic: ENV.KAFKA_TOPIC })

	await consumer.run({
		eachMessage: async ({ message }) => {
			try {
				const { id, restaurantTableId, inDate } = JSON.parse(message.value!.toString())
				await BookingService.checkingBooking(id)
				const isAvailable = await BookingService.checkingAvailable(restaurantTableId, inDate)

				if (isAvailable) {
					await BookingService.approveBooking(id, restaurantTableId)
				} else {
					await BookingService.rejectBooking(id)
				}
			} catch (e) {
				logger.error(e as Error)
			}
		},
	})
}
