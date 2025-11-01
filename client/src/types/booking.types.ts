//  data: {
//         bookingId: booking._id,
//         name: booking.name,
//         email: booking.email,
//         experience: {
//           id: experience._id,
//           destinationName: experience.destinationName,
//           placeName: experience.placeName,
//         },
//         slot: {
//           id: slot._id,
//           date: slot.date,
//           time: slot.time,
//         },
//         quantity,
//         totalAmount,
//         tax: taxRate,
//         promoUsed: appliedPromo,
//         discount: appliedPromo ? baseAmount - totalAmount : 0
//       },

export interface BookingResponse {
    bookingId: string,
    name: string,
    email: string,
    experience: {
        id: string,
        destinationName: string,
        placeName: string,
    },
    slot: {
        id: string,
        date: string,
        time: string,
    }
    quantity: number,
    totalAmount: number,
    tax: number,
    promoUsed: string | null,
    discount: number,
} 