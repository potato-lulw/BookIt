import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { Request, Response } from "express";
import { Experience } from "../models/experience.model";
import { BadRequestError, InternalServerError, NotFoundError } from "../utils/app-error";
import { HTTP_STATUS_CODE } from "../config/http.config";
import dayjs from "dayjs";
import { BookingSlot } from "../models/bookingSlot.model";


export const getAllExperienceController = asyncHandler(async (req, res) => {
    const experiences = await Experience.find(
        {},
        {
            destinationName: 1,
            placeName: 1,
            description: 1,
            price: 1,
            images: 1,
            thumbnail: 1,
        }
    ).sort({ createdAt: -1 });

    if (!experiences || experiences.length === 0) {
        throw new NotFoundError("No experiences found");
    }

    return res.status(HTTP_STATUS_CODE.OK).json({
        status: "success",
        count: experiences.length,
        data: experiences,
    });
});

export const getExpericenceByIdController = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const today = dayjs();
    const endDate = today.add(5, "day").format("YYYY-MM-DD");

    // 1️⃣ Find experience
    const experience = await Experience.findById(id);
    if (!experience) throw new NotFoundError("Experience not found");

    // 2️⃣ Find related booking slots
    const slots = await BookingSlot.find({
        experience: id,
        date: { $gte: today.format("YYYY-MM-DD"), $lt: endDate },
    }).sort({ date: 1, time: 1 });

    // 3️⃣ Group slots by date
    const groupedSlots = slots.reduce((acc: any, slot) => {
        if (!acc[slot.date]) acc[slot.date] = [];
        acc[slot.date].push({
            _id: slot._id,
            time: slot.time,
            totalSlots: slot.totalSlots,
            bookedSlots: slot.bookedSlots,
            availableSlots: slot.totalSlots - slot.bookedSlots,
            isAvailable: slot.isAvailable,
            soldOut: slot.bookedSlots >= slot.totalSlots,
        });
        return acc;
    }, {});

    // 4️⃣ Structure final response
    return res.json({
        status: "success",
        data: {
            experience: {
                _id: experience._id,
                destinationName: experience.destinationName,
                placeName: experience.placeName,
                description: experience.description,
                price: experience.price,
                thumbnail: experience.thumbnail,
                images: experience.images,
            },
            availability: Object.entries(groupedSlots).map(([date, slots]) => ({
                date,
                slots,
            })),
        },
    });
});





export const createExperienceController = asyncHandler(async (req: Request, res: Response) => {
    try {
        const {
            destinationName,
            placeName,
            description,
            price,
            images,
            timeSlots,
        } = req.body;

        // ✅ Validate required fields
        if (!destinationName || !placeName || !description || !price) {
            throw new BadRequestError("Missing required fields");
        }

        if (!Array.isArray(images) || images.length === 0) {
            throw new BadRequestError("At least one image is required");
        }

        if (!Array.isArray(timeSlots) || timeSlots.length === 0) {
            throw new BadRequestError("At least one time slot is required");
        }

        // ✅ Pick first image as thumbnail
        const thumbnail = images[0];

        // ✅ Construct and save experience
        const experience = new Experience({
            destinationName,
            placeName,
            description,
            price,
            images,
            thumbnail,
            timeSlots,
        });

        await experience.save();

        return res.status(HTTP_STATUS_CODE.CREATED).json({
            status: "success",
            data: experience,
        });
    } catch (error: any) {
        console.error("❌ Error creating experience:", error);

        if (error instanceof BadRequestError) throw error;

        throw new InternalServerError("Failed to create experience");
    }
});

