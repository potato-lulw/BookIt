import { Schema, model, Document, Types } from "mongoose";

export interface IBooking extends Document {
    user: Types.ObjectId;
    experience: Types.ObjectId;
    name: string;
    email: string;
    slot: Types.ObjectId;
    quantity: number;
    promoUsed?: string;
    tax: number;
    totalAmount: number;
    createdAt: Date;
    updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        name: { type: String, required: true },
        email: { type: String, required: true },
        experience: { type: Schema.Types.ObjectId, ref: "Experience", required: true },
        slot: { type: Schema.Types.ObjectId, ref: "BookingSlot", required: true },
        quantity: { type: Number, required: true, min: 1 },
        promoUsed: { type: String },
        tax: { type: Number, default: 0.05 }, // 5%
        totalAmount: { type: Number, required: true, min: 0 },
    },
    { timestamps: true }
);

// Hook to update booked slots automatically
bookingSchema.post("save", async function (doc, next) {
  const { slot, quantity } = doc;
  const { BookingSlot } = await import("./bookingSlot.model");

  const updatedSlot = await BookingSlot.findByIdAndUpdate(
    slot,
    { $inc: { bookedSlots: quantity } },
    { new: true }
  );

  if (updatedSlot && updatedSlot.bookedSlots >= updatedSlot.totalSlots) {
    updatedSlot.isAvailable = false;
    await updatedSlot.save(); // triggers pre-save to keep logic consistent
  }

  next();
});


export const Booking = model<IBooking>("Booking", bookingSchema);
