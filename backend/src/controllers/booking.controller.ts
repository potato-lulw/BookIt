import { asyncHandler } from "../middlewares/asyncHandler.middleware";

import { Request, Response, NextFunction } from "express";
import { Booking } from "../models/booking.model";
import { BookingSlot } from "../models/bookingSlot.model";
import { Experience } from "../models/experience.model";
import { BadRequestError, ConflictError, NotFoundError } from "../utils/app-error";
import { HTTP_STATUS_CODE } from "../config/http.config";


export const createBookingController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, experienceId, slotId, quantity, promoUsed } = req.body;

    // 🧩 Validate required fields
    if (!userId || !experienceId || !slotId || !quantity) {
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

    // 💸 Calculate total amount
    const baseAmount = experience.price * quantity;
    const taxRate = 0.05; // 5%
    const totalAmount = Math.round(baseAmount * (1 + taxRate));

    // 🧾 Create booking
    const booking = await Booking.create({
      user: userId,
      experience: experienceId,
      slot: slotId,
      quantity,
      promoUsed,
      tax: taxRate,
      totalAmount,
    });


    return res.status(HTTP_STATUS_CODE.CREATED).json({
      status: "success",
      message: "Booking confirmed successfully!",
      data: {
        bookingId: booking._id,
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
        promoUsed: promoUsed || null,
      },
    });
  }
);
