import { ENV } from './config/env'
import express, { Application } from 'express'
import bodyParser from 'body-parser'
import { ApiResponse } from './types/app-types'
import { logger } from './utils/logger'
import { db } from './config/db'
import { producer } from './services/booking-producer'

const app: Application = express()
const PORT = ENV.PORT || 5000

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

app.get('/api/bookings/:bookingId', async (req, res) => {
	try {
		const bookings = await db.query('SELECT * FROM booking WHERE id = $1', [req.params.bookingId])
		const response: ApiResponse = {
			success: true,
			message: 'ok',
			data: bookings.rows,
			errors: [],
		}
		res.status(200).json(response)
	} catch (e: unknown) {
		const err = e as Error
		res.status(500).json({
			success: false,
			message: 'error',
			data: null,
			errors: [err],
		})
	}
})

app.get('/api/bookings', async (req, res) => {
	try {
		const bookings = await db.query('SELECT * FROM booking')
		const response: ApiResponse = {
			success: true,
			message: 'ok',
			data: bookings.rows,
			errors: [],
		}
		res.status(200).json(response)
	} catch (e: unknown) {
		const err = e as Error
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
		const createdBooking = await db.query(
			"insert into booking (restaurant_id, guest_count, restaurant_table_id, booking_status) VALUES ($1,$2,$3, 'CREATED') RETURNING id, restaurant_table_id;",
			[req.body.restaurant_id, req.body.guest_count, req.body.restaurant_table_id]
		)

		await producer.send({
			topic: KAFKA_TOPIC,
			messages: [
				{
					value: JSON.stringify({
						id: createdBooking.rows[0].id,
						restaurantTableId: createdBooking.rows[0].restaurant_table_id,
						inDate: req.body.in_date,
					}),
				},
			],
		})
		
		const response: ApiResponse = {
			success: true,
			message: 'ok',
			data: createdBooking.rows,
			errors: [],
		}
		res.status(200).json(response)
	} catch (e: unknown) {
		const err = e as Error
		console.error(e)
		res.status(500).json({
			success: false,
			message: 'error',
			data: null,
			errors: [err],
		})
	}
})

app.listen(PORT, () => {
	console.log(`API service running at http://localhost:${PORT}`)
})
