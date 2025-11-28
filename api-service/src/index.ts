import { ENV } from './config/env'
import express, { Application } from 'express'
import bodyParser from 'body-parser'
import { ApiResponse } from './types/app-types'
import { logger } from './utils/logger'
import { bookingRouter } from './routes/booking-router'

const app: Application = express()
const PORT = ENV.PORT || 5000
const BASE_URL = '/api'

app.use(bodyParser.json())
app.use(logger.request)
app.use(BASE_URL, bookingRouter)

app.get(BASE_URL + '/health', (req, res) => {
	const response: ApiResponse = {
		success: true,
		message: 'ok',
		data: null,
		errors: [],
	}
	res.status(200).json(response)
})

async function start() {
	app.listen(PORT, () => {
		console.log(`API service running at http://localhost:${PORT}`)
	})
}

start()
