import { config } from 'dotenv'
config() // dotenv
import express, { Application } from 'express'
import bodyParser from 'body-parser'
import { ApiResponse, ApiError } from './types/app-types'
import { logger } from './utils/logger'
import { connect } from './db/connect'
import { Kafka, Partitioners } from 'kafkajs'

const app: Application = express()
const PORT = process.env.SERVER_PORT || 5000
const KAFKA_CLIENT_ID = 'booking-service'
const KAFKA_TOPIC = 'booking-topic'
const KAFKA_BROKER = 'localhost:9092'
const kafka = new Kafka({
	clientId: KAFKA_CLIENT_ID,
	brokers: [KAFKA_BROKER],
})

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
		const db = connect()
		const bookings = await db.query('SELECT * FROM booking WHERE id = $1', [req.params.bookingId])
		const response: ApiResponse = {
			success: true,
			message: 'ok',
			data: bookings.rows,
			errors: [],
		}
		res.status(200).json(response)
	} catch (e: unknown) {
		const err = e as ApiError
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
		const db = connect()
		const bookings = await db.query('SELECT * FROM booking')
		const response: ApiResponse = {
			success: true,
			message: 'ok',
			data: bookings.rows,
			errors: [],
		}
		res.status(200).json(response)
	} catch (e: unknown) {
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
		const createdBooking = await db.query(
			"insert into booking (restaurant_id, guest_count, restaurant_table_id, booking_status) VALUES ($1,$2,$3, 'CREATED') RETURNING id, restaurant_table_id;",
			[req.body.restaurant_id, req.body.guest_count, req.body.restaurant_table_id]
		)

		const producer = await kafka.producer({
			createPartitioner: Partitioners.LegacyPartitioner,
		})
		await producer.connect()
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
		await producer.disconnect()

		const response: ApiResponse = {
			success: true,
			message: 'ok',
			data: createdBooking.rows,
			errors: [],
		}
		res.status(200).json(response)
	} catch (e: unknown) {
		const err = e as ApiError
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
