import { Schema, model, Document } from "mongoose";

export interface IExperience extends Document {
  destinationName: string;
  placeName: string;
  description: string;
  price: number;
  images: string[];
  thumbnail: string;
  timeSlots: {
    time: string;      // e.g. "06:00", "08:00"
    capacity: number;  // total seats per time
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const experienceSchema = new Schema<IExperience>(
  {
    destinationName: { type: String, required: true, trim: true },
    placeName: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    images: { type: [String], default: [] },
    thumbnail: { type: String, required: true },
    timeSlots: [
      {
        time: { type: String, required: true },
        capacity: { type: Number, required: true, min: 1 },
      },
    ],
  },
  { timestamps: true }
);

export const Experience = model<IExperience>("Experience", experienceSchema);
