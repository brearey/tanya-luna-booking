import { config } from 'dotenv'
config() // dotenv
import express, { Application } from 'express'
import bodyParser from 'body-parser'
import { ApiResponse } from './types/app-types'
import { logger } from './utils/logger'

const app: Application = express()
const PORT = process.env.SERVER_PORT || 5001

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

app.listen(PORT, () => {
	console.log(`Booking service running at http://localhost:${PORT}`)
})
