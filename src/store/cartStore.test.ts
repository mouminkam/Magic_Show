import useCartStore, { cartItemKey } from "./cartStore";
import type { CartItem } from "@/types";

function makeItem(overrides: Partial<CartItem> = {}): CartItem {
  return {
    id: 1,
    productId: 1,
    name: "Verano Court Sneaker",
    slug: "verano-court-sneaker",
    price: 89.99,
    image: "/images/products/1.jpg",
    quantity: 1,
    size: "42",
    color: "black",
    maxQuantity: 5,
    ...overrides,
  };
}

beforeEach(() => {
  useCartStore.setState({ items: [], isOpen: false });
  window.localStorage.clear();
});

describe("cartItemKey", () => {
  it("builds a stable key from id/size/color", () => {
    expect(cartItemKey({ id: 1, size: "42", color: "black" })).toBe("1-42-black");
  });

  it("treats null size/color as empty segments, not the string 'null'", () => {
    expect(cartItemKey({ id: 7, size: null, color: null })).toBe("7--");
  });
});

describe("cartStore.addItem", () => {
  it("adds a new line for a product/size/color combination not already in the cart", () => {
    useCartStore.getState().addItem(makeItem());
    expect(useCartStore.getState().items).toHaveLength(1);
  });

  it("merges quantities when the same product/size/color is added twice", () => {
    useCartStore.getState().addItem(makeItem({ quantity: 2 }));
    useCartStore.getState().addItem(makeItem({ quantity: 3 }));

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(5);
  });

  it("keeps the same product in two different sizes as two separate lines", () => {
    useCartStore.getState().addItem(makeItem({ size: "42" }));
    useCartStore.getState().addItem(makeItem({ size: "43" }));

    expect(useCartStore.getState().items).toHaveLength(2);
  });

  it("never lets a merged line exceed maxQuantity (stock ceiling)", () => {
    useCartStore.getState().addItem(makeItem({ quantity: 3, maxQuantity: 5 }));
    useCartStore.getState().addItem(makeItem({ quantity: 10, maxQuantity: 5 }));

    expect(useCartStore.getState().items[0].quantity).toBe(5);
  });
});

describe("cartStore.updateQuantity", () => {
  it("updates the quantity of the matching line", () => {
    useCartStore.getState().addItem(makeItem({ quantity: 1 }));
    useCartStore.getState().updateQuantity({ id: 1, size: "42", color: "black" }, 4);

    expect(useCartStore.getState().items[0].quantity).toBe(4);
  });

  it("removes the line entirely when the quantity drops to zero or below", () => {
    useCartStore.getState().addItem(makeItem());
    useCartStore.getState().updateQuantity({ id: 1, size: "42", color: "black" }, 0);

    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("clamps an update above maxQuantity instead of exceeding stock", () => {
    useCartStore.getState().addItem(makeItem({ maxQuantity: 3 }));
    useCartStore.getState().updateQuantity({ id: 1, size: "42", color: "black" }, 99);

    expect(useCartStore.getState().items[0].quantity).toBe(3);
  });
});

describe("cartStore.removeItem", () => {
  it("removes only the matching line, leaving others untouched", () => {
    useCartStore.getState().addItem(makeItem({ id: 1 }));
    useCartStore.getState().addItem(makeItem({ id: 2 }));
    useCartStore.getState().removeItem({ id: 1, size: "42", color: "black" });

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe(2);
  });
});

describe("cartStore.getTotal / getItemCount", () => {
  it("computes the total as price * quantity summed across lines", () => {
    useCartStore.getState().addItem(makeItem({ id: 1, price: 10, quantity: 2 }));
    useCartStore.getState().addItem(makeItem({ id: 2, price: 5, quantity: 3 }));

    expect(useCartStore.getState().getTotal()).toBe(35);
  });

  it("counts total units across all lines, not the number of lines", () => {
    useCartStore.getState().addItem(makeItem({ id: 1, quantity: 2 }));
    useCartStore.getState().addItem(makeItem({ id: 2, quantity: 3 }));

    expect(useCartStore.getState().getItemCount()).toBe(5);
  });

  it("is zero for an empty cart", () => {
    expect(useCartStore.getState().getTotal()).toBe(0);
    expect(useCartStore.getState().getItemCount()).toBe(0);
  });
});

describe("cartStore persistence", () => {
  it("persists items to localStorage on every mutation", () => {
    useCartStore.getState().addItem(makeItem());
    const raw = window.localStorage.getItem("cart-items");
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw as string)).toHaveLength(1);
  });

  it("clearCart empties both state and storage", () => {
    useCartStore.getState().addItem(makeItem());
    useCartStore.getState().clearCart();

    expect(useCartStore.getState().items).toHaveLength(0);
    expect(JSON.parse(window.localStorage.getItem("cart-items") as string)).toHaveLength(0);
  });
});
