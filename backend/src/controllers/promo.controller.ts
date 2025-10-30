import dayjs from "dayjs";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { PromoCode } from "../models/promoCode.model";
import { BadRequestError } from "../utils/app-error";
import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS_CODE } from "../config/http.config";


export const validatePromoController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { code, totalAmount } = req.body;

    if (!code) {
      throw new BadRequestError("Promo code is required");
    }

    const promo = await PromoCode.findOne({ code: code.toUpperCase() });
    if (!promo) throw new BadRequestError("Invalid promo code");

    const now = dayjs();

    if (!promo.isActive) throw new BadRequestError("Promo code is not active");
    if (promo.validFrom && now.isBefore(promo.validFrom))
      throw new BadRequestError("Promo not yet valid");
    if (promo.validUntil && now.isAfter(promo.validUntil))
      throw new BadRequestError("Promo has expired");
    if (promo.maxUsage && promo.usedCount >= promo.maxUsage)
      throw new BadRequestError("Promo usage limit reached");

    // If totalAmount is provided, calculate the discounted price
    let discountedAmount: number | null = null;
    if (totalAmount) {
      if (promo.discountType === "percentage") {
        discountedAmount = Math.round(totalAmount * (1 - promo.discountValue / 100));
      } else {
        discountedAmount = Math.max(totalAmount - promo.discountValue, 0);
      }
    }

    return res.status(HTTP_STATUS_CODE.OK).json({
      status: "success",
      message: "Promo code is valid",
      data: {
        code: promo.code,
        description: promo.description,
        discountType: promo.discountType,
        discountValue: promo.discountValue,
        discountedAmount,
        save: discountedAmount ? totalAmount - discountedAmount : null,
        validUntil: promo.validUntil,
      },
    });
  }
);


export const createPromoController = asyncHandler(async (req, res) => {
    const { code, description, discountType, discountValue, maxUsage, validFrom, validUntil, isActive } = req.body;

    // 🧩 Validate required fields
    if (!code || !discountType || discountValue == null) {
        throw new BadRequestError("Missing required fields for promo code");
    }

    if (discountType !== "percentage" && discountType !== "flat") {
        throw new BadRequestError("Invalid discount type");
    }

    if (discountValue < 0) {
        throw new BadRequestError("Discount value must be non-negative");
    }

    const newPromo = await PromoCode.create({
        code,
        description,
        discountType,
        discountValue,
        maxUsage,
        validFrom,
        validUntil,
        isActive
    });

    return res.status(201).json({
        status: "success",
        message: "Promo code created successfully",
        data: {
            promo: newPromo
        }
    });

});
