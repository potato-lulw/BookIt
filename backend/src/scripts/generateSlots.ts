// src/scripts/generateSlots.ts
import mongoose from "mongoose";
import dayjs from "dayjs";
import chalk from "chalk";
import dotenv from "dotenv";
import { Experience } from "../models/experience.model";
import { BookingSlot } from "../models/bookingSlot.model";

dotenv.config();

export const generateSlotsForNextFiveDays = async () => {
  const today = dayjs().format("YYYY-MM-DD");
  console.log(chalk.cyan(`\n🕒 Starting slot generation for ${today}...`));

  // 1️⃣ Clean up old slots
  const deleteResult = await BookingSlot.deleteMany({ date: { $lt: today } });
  console.log(chalk.yellow(`🧹 Removed ${deleteResult.deletedCount} expired slots.`));

  // 2️⃣ Generate new slots for the next 5 days
  const experiences = await Experience.find();
  console.log(chalk.magenta(`⚙️  Found ${experiences.length} experiences.`));

  for (const exp of experiences) {
    for (let i = 0; i < 5; i++) {
      const date = dayjs().add(i, "day").format("YYYY-MM-DD");

      for (const slot of exp.timeSlots) {
        await BookingSlot.updateOne(
          { experience: exp._id, date, time: slot.time },
          {
            $setOnInsert: {
              totalSlots: slot.capacity,
              bookedSlots: 0,
              isAvailable: true,
            },
          },
          { upsert: true }
        );
      }
    }
  }

  console.log(chalk.green("✅ Slots successfully generated for the next 5 days!\n"));
};

// Optional: allow running directly via CLI
if (require.main === module) {
  (async () => {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) throw new Error("❌ Missing MONGO_URI in .env file.");

    await mongoose.connect(mongoUri);
    await generateSlotsForNextFiveDays();
    await mongoose.disconnect();
    process.exit(0);
  })();
}
