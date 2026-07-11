import cartReducer, { addToCart, removeSingleCart, removeFromCart, clearCart } from "./addToCartSlice";

const empty = { card: [], cartTotalQuantity: 0, cartTotalAmount: 0, message: null };

const item = (id, price = 100) => ({ data: { _id: id, price } });

beforeEach(() => localStorage.clear());

describe("addToCartSlice reducer", () => {
  test("initial state is empty cart", () => {
    const state = cartReducer(undefined, { type: "@@INIT" });
    expect(state.card).toHaveLength(0);
    expect(state.cartTotalQuantity).toBe(0);
  });

  test("addToCart adds a new item with quantity 1", () => {
    const state = cartReducer(empty, addToCart(item("p1", 200)));
    expect(state.card).toHaveLength(1);
    expect(state.card[0].itemQuantity).toBe(1);
    expect(state.card[0].itemAmountPrice).toBe(200);
  });

  test("addToCart increments quantity for existing item", () => {
    let state = cartReducer(empty, addToCart(item("p1", 200)));
    state = cartReducer(state, addToCart(item("p1", 200)));
    expect(state.card).toHaveLength(1);
    expect(state.card[0].itemQuantity).toBe(2);
    expect(state.card[0].itemAmountPrice).toBe(400);
  });

  test("cartTotalQuantity and cartTotalAmount are recalculated", () => {
    let state = cartReducer(empty, addToCart(item("p1", 300)));
    state = cartReducer(state, addToCart(item("p2", 100)));
    expect(state.cartTotalQuantity).toBe(2);
    expect(state.cartTotalAmount).toBe(400);
  });

  test("removeSingleCart decrements quantity", () => {
    let state = cartReducer(empty, addToCart(item("p1", 100)));
    state = cartReducer(state, addToCart(item("p1", 100)));
    state = cartReducer(state, removeSingleCart(item("p1", 100)));
    expect(state.card[0].itemQuantity).toBe(1);
  });

  test("removeSingleCart removes item when quantity reaches 0", () => {
    let state = cartReducer(empty, addToCart(item("p1", 100)));
    state = cartReducer(state, removeSingleCart(item("p1", 100)));
    expect(state.card).toHaveLength(0);
  });

  test("removeFromCart removes item regardless of quantity", () => {
    let state = cartReducer(empty, addToCart(item("p1", 100)));
    state = cartReducer(state, addToCart(item("p1", 100)));
    state = cartReducer(state, removeFromCart(item("p1", 100)));
    expect(state.card).toHaveLength(0);
    expect(state.cartTotalQuantity).toBe(0);
  });

  test("clearCart empties everything", () => {
    let state = cartReducer(empty, addToCart(item("p1", 100)));
    state = cartReducer(state, addToCart(item("p2", 200)));
    state = cartReducer(state, clearCart());
    expect(state.card).toHaveLength(0);
    expect(state.cartTotalAmount).toBe(0);
  });
});
