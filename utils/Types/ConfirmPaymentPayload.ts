export interface ConfirmPaymentPayload {
    paymentIntentId: string;
    paymentMethodId: string;
    amount: number;
    transactionRef: string;
}
