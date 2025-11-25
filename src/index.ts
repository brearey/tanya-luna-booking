import { config } from 'dotenv'
config() // dotenv
import express, { Application } from 'express'
import bodyParser from 'body-parser'
import { ApiResponse, ApiError } from './types/app-types'
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
	try {
    const db = connect()
    const bookings = await db.query('SELECT * FROM booking')
    const response: ApiResponse = {
      success: true,
      message: 'ok',
      data: bookings.rows,
      errors: [],
    }
    res.status(200).json(response)
  } catch(e: unknown) {
    const err = e as ApiError
    res.status(500).json({
      success: false,
      message: 'error',
      data: null,
      errors: [err],
    })
  }
})

app.post('/api/bookings', async (req, res) => {
	try {
    const db = connect()
    const createdBooking = await db.query('INSERT INTO booking (restaurant_id, guest_count, booking_date) VALUES ($1, $2, $3) RETURNING id',
      [req.body.restaurant_id,
      req.body.guest_count,
      req.body.booking_date]
    )
    const response: ApiResponse = {
      success: true,
      message: 'ok',
      data: createdBooking.rows,
      errors: [],
    }
    res.status(200).json(response)
  } catch(e: unknown) {
    const err = e as ApiError
    res.status(500).json({
      success: false,
      message: 'error',
      data: null,
      errors: [err],
    })
  }
})

app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`)
})
