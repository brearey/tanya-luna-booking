import express from 'express'
import bodyParser from 'body-parser'
import { startConsumer } from './services/booking-consumer'
import { ENV } from './config/env'

const app = express()
app.use(bodyParser.json())

startConsumer()

app.listen(ENV.PORT, () => {
	console.log(`Server running on port ${ENV.PORT}`)
})
