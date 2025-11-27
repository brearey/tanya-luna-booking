import { kafka } from '../config/kafka'
import { ENV } from '../config/env'
import { BookingService } from './booking-service'

export const startConsumer = async () => {
	const consumer = kafka.consumer({ groupId: 'booking_group' })
	await consumer.connect()
	await consumer.subscribe({ topic: ENV.KAFKA_TOPIC })

	await consumer.run({
		eachMessage: async ({ message }) => {
			try {
				const { bookingId, approved } = JSON.parse(message.value!.toString())

				if (approved) {
					await BookingService.approveBooking(bookingId)
				} else {
					await BookingService.rejectBooking(bookingId)
				}
			} catch (e) {
				console.error('Kafka consumer error:', e)
			}
		},
	})
}
