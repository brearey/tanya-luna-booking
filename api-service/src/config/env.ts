import { config } from 'dotenv'
config()

export const ENV = {
	PORT: process.env.SERVER_PORT ?? 5000,
	POSTGRES_HOST: process.env.POSTGRES_HOST ?? 'localhost',
	POSTGRES_USER: process.env.POSTGRES_USER ?? 'tanya',
	POSTGRES_DB: process.env.POSTGRES_DB ?? 'loona',
	POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD ?? 'tanya',
}
