import { config } from 'dotenv'
config() // dotenv
import express, { Application } from 'express'
import bodyParser from 'body-parser'
import { ApiResponse } from './types/app-types'
import { logger } from './utils/logger'
import { connect } from './db/connect'

const app: Application = express()
const PORT = process.env.SERVER_PORT || 5000

app.use(bodyParser.json())
app.use(logger.request)

app.get('/api/health', (req, res) => {
	const response: ApiResponse = {
		success: true,
		message: 'ok',
		data: null,
		errors: [],
	}
	res.status(200).json(response)
})

app.get('/api/bookings', async (req, res) => {
	const db = connect()
	const bookings = await db.query('SELECT * FROM booking')
	const response: ApiResponse = {
		success: true,
		message: 'ok',
		data: bookings.rows,
		errors: [],
	}
	res.status(200).json(response)
})

app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`)
})
