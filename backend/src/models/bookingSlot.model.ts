import { Schema, model, Document, Types } from "mongoose";

export interface IBookingSlot extends Document {
  experience: Types.ObjectId;
  date: string; // e.g. "2025-11-01"
  time: string; // e.g. "10:00"
  totalSlots: number;
  bookedSlots: number;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSlotSchema = new Schema<IBookingSlot>(
  {
    experience: { type: Schema.Types.ObjectId, ref: "Experience", required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    totalSlots: { type: Number, required: true },
    bookedSlots: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Keep slots unique per experience/date/time combo
bookingSlotSchema.index({ experience: 1, date: 1, time: 1 }, { unique: true });

// Auto-toggle availability
bookingSlotSchema.pre("save", function (next) {
  this.isAvailable = this.bookedSlots < this.totalSlots;
  next();
});

export const BookingSlot = model<IBookingSlot>("BookingSlot", bookingSlotSchema);
