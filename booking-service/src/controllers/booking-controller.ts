import { Request, Response } from 'express'
import { BookingService } from '../services/booking-service'

export const BookingController = {
  create: async (req: Request, res: Response) => {
    try {
      const { name, date } = req.body

      if (!name || !date) {
        return res.status(400).json({ error: "name and date required" })
      }

      const booking = await BookingService.createBooking(name, date)
      res.json(booking)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: "Internal server error" })
    }
  }
}
