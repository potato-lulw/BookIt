export interface PromoValidateResponse {
    code: string;
    description: string;
    discountType: string,
    discountValue: number,
    discountedAmount: number,
    save: number,
    validUntil: string
}