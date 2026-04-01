import type { CartView } from "@/features/cart/cart.types";

type ApiSuccess<T> = { data: T };
type ApiFailure = { error: string };

async function readApiPayload<T>(response: Response): Promise<ApiSuccess<T> | ApiFailure> {
  const payload = (await response.json().catch(() => null)) as ApiSuccess<T> | ApiFailure | null;

  if (!payload || typeof payload !== "object") {
    return { error: "Invalid response" };
  }

  return payload as ApiSuccess<T> | ApiFailure;
}

export type CartMutationResult =
  | { ok: true; cart: CartView }
  | { ok: false; error: string; status: number };

export async function fetchStoreCart(slug: string): Promise<CartMutationResult> {
  const response = await fetch(`/api/stores/${encodeURIComponent(slug)}/cart`, {
    credentials: "same-origin",
  });
  const payload = await readApiPayload<CartView>(response);

  if (!response.ok || !("data" in payload)) {
    return {
      ok: false,
      error: "error" in payload ? payload.error : "Unable to load cart",
      status: response.status,
    };
  }

  return { ok: true, cart: payload.data };
}

export async function postAddToCart(
  slug: string,
  body: { productId: string; quantity: number }
): Promise<CartMutationResult> {
  const response = await fetch(`/api/stores/${encodeURIComponent(slug)}/cart`, {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload = await readApiPayload<CartView>(response);

  if (!response.ok || !("data" in payload)) {
    return {
      ok: false,
      error: "error" in payload ? payload.error : "Unable to add to cart",
      status: response.status,
    };
  }

  return { ok: true, cart: payload.data };
}

export async function patchCartQuantity(
  slug: string,
  body: { productId: string; quantity: number }
): Promise<CartMutationResult> {
  const response = await fetch(`/api/stores/${encodeURIComponent(slug)}/cart`, {
    method: "PATCH",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload = await readApiPayload<CartView>(response);

  if (!response.ok || !("data" in payload)) {
    return {
      ok: false,
      error: "error" in payload ? payload.error : "Unable to update cart",
      status: response.status,
    };
  }

  return { ok: true, cart: payload.data };
}

export async function deleteCartItem(slug: string, body: { productId: string }): Promise<CartMutationResult> {
  const response = await fetch(`/api/stores/${encodeURIComponent(slug)}/cart`, {
    method: "DELETE",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload = await readApiPayload<CartView>(response);

  if (!response.ok || !("data" in payload)) {
    return {
      ok: false,
      error: "error" in payload ? payload.error : "Unable to remove item",
      status: response.status,
    };
  }

  return { ok: true, cart: payload.data };
}
