import { config } from 'dotenv'
config()

export const ENV = {
	PORT: process.env.SERVER_PORT ?? 5000,
	POSTGRES_HOST: process.env.POSTGRES_HOST ?? 'localhost',
	POSTGRES_USER: process.env.POSTGRES_USER ?? 'tanya',
	POSTGRES_DB: process.env.POSTGRES_DB ?? 'loona',
	POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD ?? 'tanya',
  KAFKA_BROKER: process.env.KAFKA_BROKER ?? 'localhost:9092',
	KAFKA_TOPIC: process.env.KAFKA_TOPIC ?? 'booking-topic',
  KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID ?? 'booking-service',
}
