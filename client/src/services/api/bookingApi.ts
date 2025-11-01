import type { ApiResponse } from "@/types/api.types";
import { api } from "../api";
import type { BookingResponse } from "@/types/booking.types";

export interface BookingRequest {
    userId: string;
    name: string;
    email: string;
    experienceId: string;
    slotId: string;
    quantity: number;
    promoUsed?: string;
}

export const bookingApi = api.injectEndpoints({
    endpoints: (builder) => ({
        bookExperience: builder.mutation<ApiResponse<BookingResponse>, BookingRequest>({
            query: (bookingData) => ({
                url: "/bookings",
                method: "POST",
                body: bookingData,
            }),
        })
    }),
    overrideExisting: false,
}) 

export const {
    useBookExperienceMutation,
} = bookingApi;