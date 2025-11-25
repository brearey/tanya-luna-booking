// Database
import { Client } from 'pg'
import Pool from 'pg-pool'

export function connect(): Pool<Client> {
	return new Pool({
		user: process.env.POSTGRES_USER,
		host: process.env.POSTGRES_HOST,
		database: process.env.POSTGRES_DB,
		password: process.env.POSTGRES_PASSWORD,
		port: 5432,
		max: 20,
		idleTimeoutMillis: 30000,
		connectionTimeoutMillis: 2000,
	})
}
