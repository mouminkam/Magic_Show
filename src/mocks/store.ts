import type { Customer, Order } from "@/types";
import { demoCustomer, seedOrders, seedWishlistProductIds } from "./data/account";

/**
 * Mutable slice of the mock backend.
 *
 * Server renders always see the pristine seed. In the browser, mutations
 * (orders placed, wishlist toggles, profile edits) are layered on top and
 * persisted to `localStorage`, so a placed order survives the navigation to
 * `/order-confirmation/[orderId]` and a page refresh after it.
 */

const STORAGE_KEY = "magicshow:mock-db";

interface MockDbState {
  orders: Order[];
  wishlistProductIds: number[];
  customer: Customer;
  /** Highest order id issued so far; the next order takes `nextOrderId + 1`. */
  lastOrderId: number;
}

function seedState(): MockDbState {
  return {
    orders: seedOrders.map((order) => ({ ...order })),
    wishlistProductIds: [...seedWishlistProductIds],
    customer: { ...demoCustomer },
    lastOrderId: seedOrders.reduce((max, order) => Math.max(max, order.id), 1000),
  };
}

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function isMockDbState(value: unknown): value is MockDbState {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<MockDbState>;
  return (
    Array.isArray(candidate.orders) &&
    Array.isArray(candidate.wishlistProductIds) &&
    typeof candidate.lastOrderId === "number" &&
    typeof candidate.customer === "object" &&
    candidate.customer !== null
  );
}

let cache: MockDbState | null = null;

function read(): MockDbState {
  if (cache) return cache;

  if (!isBrowser()) {
    cache = seedState();
    return cache;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (isMockDbState(parsed)) {
        cache = parsed;
        return cache;
      }
    }
  } catch {
    // Corrupt or unavailable storage — fall through to a fresh seed.
  }

  cache = seedState();
  return cache;
}

function write(next: MockDbState): void {
  cache = next;
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Quota or private-mode failure: the in-memory cache still holds the value
    // for the lifetime of the tab, which is enough for the demo.
  }
}

export const mockDb = {
  getOrders(): Order[] {
    return read().orders;
  },

  getOrder(id: number): Order | undefined {
    return read().orders.find((order) => order.id === id);
  },

  getOrderByNumber(orderNumber: string): Order | undefined {
    return read().orders.find((order) => order.orderNumber === orderNumber);
  },

  addOrder(build: (nextId: number) => Order): Order {
    const state = read();
    const nextId = state.lastOrderId + 1;
    const order = build(nextId);
    write({ ...state, orders: [order, ...state.orders], lastOrderId: nextId });
    return order;
  },

  getWishlistProductIds(): number[] {
    return read().wishlistProductIds;
  },

  setWishlistProductIds(ids: number[]): void {
    const state = read();
    write({ ...state, wishlistProductIds: [...new Set(ids)] });
  },

  getCustomer(): Customer {
    return read().customer;
  },

  setCustomer(customer: Customer): void {
    const state = read();
    write({ ...state, customer });
  },

  /** Clears persisted mutations — used by the logout flow and by tests. */
  reset(): void {
    cache = seedState();
    if (isBrowser()) {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Nothing to do; the in-memory cache has already been reset.
      }
    }
  },
};
