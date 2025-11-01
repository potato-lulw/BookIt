
import { api } from "../api";
import type { ApiResponse } from "@/types/api.types";
import type { PromoValidateResponse } from "@/types/promo.types";

export const promoApi = api.injectEndpoints({
    endpoints: (builder) => ({
        validatePromo: builder.mutation<ApiResponse<PromoValidateResponse>, { code: string, totalAmount: number }>({
            query: (body) => ({
                url: '/promo/validate',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Promo'],

        })
    })
})

export const { useValidatePromoMutation } = promoApi;