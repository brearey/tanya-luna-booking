import { config } from 'dotenv'
config() // dotenv
import express, { Application } from 'express'
import bodyParser from 'body-parser'
import { ApiResponse } from './types/app-types'
import { logger } from './utils/logger'
import { Kafka, Partitioners } from 'kafkajs'

const app: Application = express()
const PORT = process.env.SERVER_PORT || 5001
const KAFKA_CLIENT_ID = 'booking-service'
const KAFKA_TOPIC = 'booking-topic'
const KAFKA_BROKER = 'localhost:9092'
const kafka = new Kafka({
  clientId: KAFKA_CLIENT_ID,
  brokers: [KAFKA_BROKER]
})

app.use(bodyParser.json())
app.use(logger.request)

app.get('/api/health', async (req, res) => {
  const producer = await kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner
  })
  await producer.connect()
  await producer.send({
    topic: KAFKA_TOPIC,
    messages: [
      { value: `lorriant at ${Date.now().toString()}` }
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

async function subscribe() {
  const consumer = kafka.consumer({ groupId: 'test-group' })

  await consumer.connect()
  await consumer.subscribe({ topic: KAFKA_TOPIC, fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        message: message.value,
        topic: topic,
        partition: partition,
      })
    },
  })
}

subscribe()

app.listen(PORT, () => {
	console.log(`Booking service running at http://localhost:${PORT}`)
})
