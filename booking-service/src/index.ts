import { config } from 'dotenv'
config() // dotenv
import express, { Application } from 'express'
import bodyParser from 'body-parser'
import { ApiResponse } from './types/app-types'
import { logger } from './utils/logger'
import { connect } from './db/connect'
import { Kafka } from 'kafkajs'

const app: Application = express()
const PORT = process.env.SERVER_PORT || 5001
const KAFKA_CLIENT_ID = 'booking-service'
const KAFKA_TOPIC = 'booking-topic'
const KAFKA_BROKER = 'localhost:9092'
const kafka = new Kafka({
	clientId: KAFKA_CLIENT_ID,
	brokers: [KAFKA_BROKER],
})
const db = connect()

app.use(bodyParser.json())
app.use(logger.request)

app.get('/api/health', async (req, res) => {
	const response: ApiResponse = {
		success: true,
		message: 'ok',
		data: null,
		errors: [],
	}
	res.status(200).json(response)
})

async function subscribe() {
	const consumer = kafka.consumer({ groupId: 'booking-group' })

	await consumer.connect()
	await consumer.subscribe({ topic: KAFKA_TOPIC, fromBeginning: true })

	await consumer.run({
		eachMessage: async ({ topic, partition, message }) => {
			if (message && message?.value) {
				const msg = JSON.parse(message.value.toString())
				console.log({
					id: msg.id,
					status: msg.status,
					inDate: msg.inDate,
					topic: topic,
					partition: partition,
				})
				// select * from booking where id = 2;
				const bookingResult = await db.query('select * from booking where id = $1;', [msg.id])
				// Set booking status CHECKING_AVAILABILITY
				await db.query("update booking set booking_status = 'CHECKING_AVAILABILITY' where id = $1 returning id", [
					bookingResult.rows[0].id,
				])
				/*
        rows: [
          {
            id: 3,
            restaurant_id: '1',
            restaurant_table_id: '2',
            guest_count: '4',
            booking_status: 'CREATED'
          }
        ],
        */
				// select * from restaurant_table where is_available = true and id = 2;
				const restaurantTableResult = await db.query(
					'select * from restaurant_table where is_available = true and id = $1 and in_date = $2;',
					[bookingResult.rows[0].restaurant_table_id, msg.inDate]
				)
				const isAvailable = restaurantTableResult.rows[0]?.is_available
					? restaurantTableResult.rows[0].is_available
					: null
				if (isAvailable) {
					await db.query('update restaurant_table set is_available = false where id = $1', [
						bookingResult.rows[0].restaurant_table_id,
					])
					// const updatedTableId = updateTableResult.rows[0].id
					await db.query("update booking set booking_status = 'CONFIRMED' where id = $1", [bookingResult.rows[0].id])
					// const updatedBookingId = updateBookingResult.rows[0].id
				} else {
					await db.query("update booking set booking_status = 'REJECTED' where id = $1", [bookingResult.rows[0].id])
					// const updatedBookingId = updateBookingResult.rows[0].id
				}
			}
		},
	})
}

subscribe()

app.listen(PORT, () => {
	console.log(`Booking service running at http://localhost:${PORT}`)
})
