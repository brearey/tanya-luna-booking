import { config } from 'dotenv'
config()

export const ENV = {
	PORT: process.env.SERVER_PORT ?? 5001,
	KAFKA_BROKER: process.env.KAFKA_BROKER ?? 'localhost:9092',
	KAFKA_TOPIC: process.env.KAFKA_TOPIC ?? 'booking-topic',
	KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID ?? 'booking-service',
}
