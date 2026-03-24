export type PaymentConfirmationItem = {
  productId: string;
  quantity: number;
};

export type PaymentConfirmationResult = {
  orderId: string;
  storeId: string;
  orderStatus: "PENDING_PAYMENT" | "PAID" | "CANCELED";
  paymentStatus: "PENDING" | "CONFIRMED";
  totalAmount: number;
  confirmedAt: Date | null;
  items: PaymentConfirmationItem[];
};
