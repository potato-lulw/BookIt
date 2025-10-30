import { Router } from "express";
import { validatePromoController } from "../controllers/promo.controller";

const PromoRouter = Router()
    .post('/validate', validatePromoController);

export default PromoRouter;