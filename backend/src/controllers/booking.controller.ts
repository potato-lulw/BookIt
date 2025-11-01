import { asyncHandler } from "../middlewares/asyncHandler.middleware";

import { Request, Response, NextFunction } from "express";
import { Booking } from "../models/booking.model";
import { BookingSlot } from "../models/bookingSlot.model";
import { Experience } from "../models/experience.model";
import { BadRequestError, ConflictError, NotFoundError } from "../utils/app-error";
import { HTTP_STATUS_CODE } from "../config/http.config";
import { PromoCode } from "../models/promoCode.model";
import dayjs from "dayjs";




export const createBookingController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, name, email,  experienceId, slotId, quantity, promoUsed } = req.body;

    // 🧩 Validate required fields
    if (!userId || !experienceId || !slotId || !quantity || !name || !email) {
      throw new BadRequestError("Missing required fields for booking");
    }

    if (quantity <= 0) {
      throw new BadRequestError("Quantity must be at least 1");
    }

    // 🧭 Fetch slot + experience
    const slot = await BookingSlot.findById(slotId);
    if (!slot) throw new NotFoundError("Booking slot not found");

    const experience = await Experience.findById(experienceId);
    if (!experience) throw new NotFoundError("Experience not found");

    // 💡 Check slot capacity
    const availableSlots = slot.totalSlots - slot.bookedSlots;
    if (availableSlots <= 0 || !slot.isAvailable) {
      throw new ConflictError("This slot is sold out");
    }

    if (quantity > availableSlots) {
      throw new ConflictError(`Only ${availableSlots} slot(s) left`);
    }

    // 💸 Calculate base amount and tax
    const baseAmount = experience.price * quantity;
    const taxRate = 0.05; // 5% default
    let totalAmount = Math.round(baseAmount * (1 + taxRate));
    let appliedPromo: string | null = null;

    // 🎟️ Validate and apply promo code (if provided)
    if (promoUsed) {
      const promo = await PromoCode.findOne({ code: promoUsed.toUpperCase() });
      if (!promo) throw new BadRequestError("Invalid promo code");

      const now = dayjs();

      if (!promo.isActive) throw new BadRequestError("Promo code is not active");
      if (promo.validFrom && now.isBefore(promo.validFrom))
        throw new BadRequestError("Promo not yet valid");
      if (promo.validUntil && now.isAfter(promo.validUntil))
        throw new BadRequestError("Promo has expired");
      if (promo.maxUsage && promo.usedCount >= promo.maxUsage)
        throw new BadRequestError("Promo usage limit reached");

      // Apply discount
      if (promo.discountType === "percentage") {
        totalAmount = Math.round(totalAmount * (1 - promo.discountValue / 100));
      } else {
        totalAmount = Math.max(totalAmount - promo.discountValue, 0);
      }

      appliedPromo = promo.code;
      promo.usedCount += 1;
      await promo.save();
    }

    // 🧾 Create booking
    const booking = await Booking.create({
      user: userId,
      experience: experienceId,
      email,
      name,
      slot: slotId,
      quantity,
      promoUsed: appliedPromo,
      tax: taxRate,
      totalAmount,
    });

    // ✅ Update slot availability manually so pre-save hook updates isAvailable
    slot.bookedSlots += quantity;
    await slot.save(); // triggers pre("save") → auto updates isAvailable

    // 🎉 Respond with booking summary
    return res.status(HTTP_STATUS_CODE.CREATED).json({
      status: "success",
      message: "Booking confirmed successfully!",
      data: {
        bookingId: booking._id,
        name: booking.name,
        email: booking.email,
        experience: {
          id: experience._id,
          destinationName: experience.destinationName,
          placeName: experience.placeName,
        },
        slot: {
          id: slot._id,
          date: slot.date,
          time: slot.time,
        },
        quantity,
        totalAmount,
        tax: taxRate,
        promoUsed: appliedPromo,
        discount: appliedPromo ? baseAmount - totalAmount : 0
      },
    });
  }
);

