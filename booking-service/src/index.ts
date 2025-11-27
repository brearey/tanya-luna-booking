import express from 'express'
import { startConsumer } from './services/booking-consumer'
import { ENV } from './config/env'
import { logger } from './utils/logger'

const app = express()

startConsumer()

app.listen(ENV.PORT, () => {
	logger.info(`Server running on port ${ENV.PORT}`)
})
