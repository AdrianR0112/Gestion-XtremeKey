import { CART_STORAGE_KEY } from "@/lib/auth";
import type { CartLine } from "@/modules/cart/cart.types";
import type { CartProductPayload } from "@/modules/cart/cart.store";

type CartState = {
  items: CartLine[];
  hydrated: boolean;
};

let state: CartState = {
  items: [],
  hydrated: false,
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function persist() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
}

export const cartStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);

    return () => listeners.delete(listener);
  },
  getSnapshot() {
    return state;
  },
  hydrate() {
    if (typeof window === "undefined" || state.hydrated) {
      return;
    }

    const storedValue = window.localStorage.getItem(CART_STORAGE_KEY);

    if (storedValue) {
      state = {
        items: JSON.parse(storedValue) as CartLine[],
        hydrated: true,
      };
    } else {
      state = { ...state, hydrated: true };
    }

    emit();
  },
  addItem(product: CartProductPayload) {
    const existingItem = state.items.find((item) => item.productId === product.id);

    if (existingItem) {
      state = {
        ...state,
        items: state.items.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        ),
      };
    } else {
      state = {
        ...state,
        items: [
          ...state.items,
          {
            productId: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            quantity: 1,
          },
        ],
      };
    }

    persist();
    emit();
  },
  removeItem(productId: string) {
    state = {
      ...state,
      items: state.items.filter((item) => item.productId !== productId),
    };
    persist();
    emit();
  },
  updateQuantity(productId: string, quantity: number) {
    state = {
      ...state,
      items: state.items
        .map((item) =>
          item.productId === productId
            ? {
                ...item,
                quantity,
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    };

    persist();
    emit();
  },
  clear() {
    state = {
      ...state,
      items: [],
    };
    persist();
    emit();
  },
};
