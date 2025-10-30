import { Router } from "express";
import ExperienceRouter from "./experience.route";
import BookingRouter from "./booking.routes";
import PromoRouter from "./promo.routes";

const routes = Router();
routes.use('/experiences', ExperienceRouter);
routes.use('/bookings', BookingRouter);
routes.use('/promo', PromoRouter);


export default routes;
