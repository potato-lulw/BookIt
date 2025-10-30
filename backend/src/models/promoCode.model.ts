import { Schema, model, Document } from "mongoose";

export interface IPromoCode extends Document {
  code: string;
  description?: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  maxUsage?: number;
  usedCount: number;
  validFrom?: Date;
  validUntil?: Date;
  isActive: boolean;
}

const promoCodeSchema = new Schema<IPromoCode>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String },
    discountType: { type: String, enum: ["percentage", "flat"], required: true },
    discountValue: { type: Number, required: true, min: 0 },
    maxUsage: { type: Number },
    usedCount: { type: Number, default: 0 },
    validFrom: { type: Date },
    validUntil: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const PromoCode = model<IPromoCode>("PromoCode", promoCodeSchema);
