import { getStoreBySlug } from "@/features/store/store.service";
import {
  createOrderWithPendingPayment,
  findOrderByIdAndStore,
  listOrdersByStoreId,
  listProductsForCheckout,
} from "./order.repository";
import type {
  CheckoutItemInput,
  CheckoutOrderResult,
  CreateOrderFromCheckoutInput,
  OrderDetail,
  OrderListItem,
  ValidatedCheckoutItem,
} from "./order.types";

export class OrderValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OrderValidationError";
  }
}

export class OrderNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OrderNotFoundError";
  }
}

function normalizeCheckoutItems(items: CheckoutItemInput[]): CheckoutItemInput[] {
  const quantityByProduct = new Map<string, number>();

  for (const item of items) {
    const current = quantityByProduct.get(item.productId) ?? 0;
    quantityByProduct.set(item.productId, current + item.quantity);
  }

  return Array.from(quantityByProduct.entries()).map(([productId, quantity]) => ({
    productId,
    quantity,
  }));
}

function normalizeCheckoutInput(input: CreateOrderFromCheckoutInput): CreateOrderFromCheckoutInput {
  return {
    storeSlug: input.storeSlug.trim().toLowerCase(),
    userId: input.userId?.trim(),
    customer: {
      firstName: input.customer.firstName.trim(),
      lastName: input.customer.lastName.trim(),
      street: input.customer.street.trim(),
      number: input.customer.number.trim(),
      city: input.customer.city.trim(),
      state: input.customer.state.trim(),
      country: input.customer.country.trim(),
      identificationNumber: input.customer.identificationNumber.trim(),
      phone: input.customer.phone.trim(),
    },
    items: normalizeCheckoutItems(
      input.items.map((item) => ({
        productId: item.productId.trim(),
        quantity: item.quantity,
      }))
    ),
  };
}

function ensureCheckoutItemsProvided(items: CheckoutItemInput[]): void {
  if (items.length === 0) {
    throw new OrderValidationError("Order must contain at least one item");
  }
}

function computeTotalAmount(items: ValidatedCheckoutItem[]): number {
  return items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
}

export async function createOrderFromCheckout(
  input: CreateOrderFromCheckoutInput
): Promise<CheckoutOrderResult> {
  const normalizedInput = normalizeCheckoutInput(input);
  ensureCheckoutItemsProvided(normalizedInput.items);

  const store = await getStoreBySlug(normalizedInput.storeSlug);
  const products = await listProductsForCheckout(
    store.id,
    normalizedInput.items.map((item) => item.productId)
  );
  const productById = new Map(products.map((product) => [product.id, product]));

  const validatedItems: ValidatedCheckoutItem[] = normalizedInput.items.map((item) => {
    const product = productById.get(item.productId);

    if (!product || !product.isActive) {
      throw new OrderValidationError("One or more cart items are unavailable for this store");
    }

    if (item.quantity > product.stock) {
      throw new OrderValidationError("One or more cart items exceed available stock");
    }

    return {
      productId: product.id,
      quantity: item.quantity,
      unitPrice: product.price,
    };
  });

  const totalAmount = computeTotalAmount(validatedItems);

  return createOrderWithPendingPayment({
    storeId: store.id,
    userId: normalizedInput.userId && normalizedInput.userId.length > 0 ? normalizedInput.userId : undefined,
    customer: normalizedInput.customer,
    items: validatedItems,
    totalAmount,
  });
}

export async function listOrdersForStore(storeId: string): Promise<OrderListItem[]> {
  return listOrdersByStoreId(storeId);
}

export async function getOrderForStore(storeId: string, orderId: string): Promise<OrderDetail> {
  const order = await findOrderByIdAndStore(orderId, storeId);

  if (!order) {
    throw new OrderNotFoundError("Order not found");
  }

  return order;
}
