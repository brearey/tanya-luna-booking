import { config } from 'dotenv'
config() // dotenv
import express, { Application } from 'express'
import bodyParser from 'body-parser'
import { ApiResponse } from './types/app-types'
import { logger } from './utils/logger'
import { Kafka } from 'kafkajs'

const app: Application = express()
const PORT = process.env.SERVER_PORT || 5001
const KAFKA_CLIENT_ID = 'booking-service'
const KAFKA_TOPIC = 'booking-topic'
const KAFKA_BROKER = 'localhost:9092'

app.use(bodyParser.json())
app.use(logger.request)

app.get('/api/health', async (req, res) => {
  const kafka = new Kafka({
    clientId: KAFKA_CLIENT_ID,
    brokers: [KAFKA_BROKER]
  })

  const producer = await kafka.producer()
  await producer.connect()
  await producer.send({
    topic: KAFKA_TOPIC,
    messages: [
      { value: Date.now().toString() }
    ]
  })
  await producer.disconnect()

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
