// Database
import { ENV } from './env'
import Pool from 'pg-pool'

export const db = new Pool({
	user: ENV.POSTGRES_USER,
	host: ENV.POSTGRES_HOST,
	database: ENV.POSTGRES_DB,
	password: ENV.POSTGRES_PASSWORD,
	port: 5432,
	max: 20,
	idleTimeoutMillis: 30000,
	connectionTimeoutMillis: 2000,
})
