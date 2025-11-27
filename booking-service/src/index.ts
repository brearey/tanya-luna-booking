import express from 'express'
import bodyParser from 'body-parser'
import { startConsumer } from './services/booking-consumer'
import { ENV } from './config/env'
import { logger } from './utils/logger'

const app = express()
app.use(bodyParser.json())

startConsumer()

app.listen(ENV.PORT, () => {
	logger.info(`Server running on port ${ENV.PORT}`)
})
