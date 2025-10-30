import { Router } from "express";
import { createPromoController, validatePromoController } from "../controllers/promo.controller";

const PromoRouter = Router()
    .post('/create', createPromoController)
    .post('/validate', validatePromoController);


export default PromoRouter;