export type CheckoutCustomer = {
  firstName: string;
  lastName: string;
  street: string;
  number: string;
  city: string;
  state: string;
  country: string;
  identificationNumber: string;
  phone: string;
};

export type CheckoutItemInput = {
  productId: string;
  quantity: number;
};

export type CreateOrderFromCheckoutInput = {
  storeSlug: string;
  customer: CheckoutCustomer;
  items: CheckoutItemInput[];
  userId?: string;
};

export type CheckoutProduct = {
  id: string;
  storeId: string;
  name: string;
  price: number;
  stock: number;
  isActive: boolean;
};

export type ValidatedCheckoutItem = {
  productId: string;
  quantity: number;
  unitPrice: number;
};

export type OrderItemView = {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

export type CheckoutOrderResult = {
  id: string;
  storeId: string;
  status: "PENDING_PAYMENT" | "PAID" | "CANCELED";
  paymentStatus: "PENDING" | "CONFIRMED";
  totalAmount: number;
  customer: CheckoutCustomer;
  items: OrderItemView[];
  createdAt: Date;
};

export type OrderListItem = {
  id: string;
  storeId: string;
  status: "PENDING_PAYMENT" | "PAID" | "CANCELED";
  firstName: string;
  lastName: string;
  totalAmount: number;
  createdAt: Date;
  paymentStatus: "PENDING" | "CONFIRMED" | null;
};

export type OrderDetail = {
  id: string;
  storeId: string;
  status: "PENDING_PAYMENT" | "PAID" | "CANCELED";
  totalAmount: number;
  createdAt: Date;
  customer: CheckoutCustomer;
  items: OrderItemView[];
  paymentStatus: "PENDING" | "CONFIRMED" | null;
};
