import { Partitioners, type Producer } from 'kafkajs'
import { BookingDTO } from '../types/app-types'
import { kafka } from '../config/kafka'
import { ENV } from '../config/env'

export async function createProducer() {
	const prod = await kafka.producer({
		createPartitioner: Partitioners.LegacyPartitioner,
	})
	await prod.connect()
	return prod
}

export async function sendMessage(prod: Producer, booking: BookingDTO) {
	await prod.send({
		topic: ENV.KAFKA_TOPIC,
		messages: [
			{
				value: JSON.stringify(booking),
			},
		],
	})
}
