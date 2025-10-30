import { Router } from "express";
import { createBookingController } from "../controllers/booking.controller";

const BookingRouter = Router()
    .post('/', createBookingController);

export default BookingRouter;