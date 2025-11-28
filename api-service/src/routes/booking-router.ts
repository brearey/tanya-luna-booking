import { Router, type Request, type Response } from 'express'
import { BookingRepository } from '../repo/booking-repo'
import { ApiResponse, BookingDTO } from '../types/app-types'
import { createProducer, sendMessage } from '../services/booking-producer'
import { logger } from '../utils/logger'

export const bookingRouter = Router()

bookingRouter.get('/bookings/:bookingId', async (req: Request, res: Response) => {
	try {
		const { bookingId } = req.params
		const bookings = await BookingRepository.getBookingById(Number(bookingId))
		const response: ApiResponse = {
			success: true,
			message: 'ok',
			data: bookings.rows,
			errors: [],
		}
		res.status(200).json(response)
	} catch (e: unknown) {
		const err = e as Error
		logger.error(err)
		res.status(500).json({
			success: false,
			message: 'error',
			data: null,
			errors: [err],
		})
	}
})

bookingRouter.get('/bookings', async (req: Request, res: Response) => {
	try {
		const bookings = await BookingRepository.getBookings()
		const response: ApiResponse = {
			success: true,
			message: 'ok',
			data: bookings.rows,
			errors: [],
		}
		res.status(200).json(response)
	} catch (e: unknown) {
		const err = e as Error
		logger.error(err)
		res.status(500).json({
			success: false,
			message: 'error',
			data: null,
			errors: [err],
		})
	}
})

bookingRouter.post('/bookings', async (req: Request, res: Response) => {
	try {
		const createdBooking = await BookingRepository.createBooking(
			req.body.restaurant_id,
			req.body.guest_count,
			req.body.restaurant_table_id
		)

		const booking: BookingDTO = {
			id: createdBooking.rows[0].id,
			restaurantTableId: createdBooking.rows[0].restaurant_table_id,
			inDate: req.body.in_date,
		}
		const producer = await createProducer()
		await sendMessage(producer, booking)

		const response: ApiResponse = {
			success: true,
			message: 'ok',
			data: createdBooking.rows,
			errors: [],
		}
		res.status(200).json(response)
	} catch (e: unknown) {
		const err = e as Error
		logger.error(err)
		res.status(500).json({
			success: false,
			message: 'error',
			data: null,
			errors: [err],
		})
	}
})
