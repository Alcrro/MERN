import favoritesReducer, { toggleFavorite, clearFavorites } from "./favoritesSlice";

const empty = { items: [] };
const product = (id) => ({ _id: id, brand: "Apple", model: "iPhone 15", price: 4499 });

beforeEach(() => localStorage.clear());

describe("favoritesSlice reducer", () => {
  test("initial state is empty", () => {
    const state = favoritesReducer(undefined, { type: "@@INIT" });
    expect(state.items).toHaveLength(0);
  });

  test("toggleFavorite adds a product", () => {
    const state = favoritesReducer(empty, toggleFavorite(product("p1")));
    expect(state.items).toHaveLength(1);
    expect(state.items[0]._id).toBe("p1");
  });

  test("toggleFavorite removes an already-favorited product", () => {
    let state = favoritesReducer(empty, toggleFavorite(product("p1")));
    state = favoritesReducer(state, toggleFavorite(product("p1")));
    expect(state.items).toHaveLength(0);
  });

  test("toggleFavorite with two different products keeps both", () => {
    let state = favoritesReducer(empty, toggleFavorite(product("p1")));
    state = favoritesReducer(state, toggleFavorite(product("p2")));
    expect(state.items).toHaveLength(2);
  });

  test("clearFavorites empties items", () => {
    let state = favoritesReducer(empty, toggleFavorite(product("p1")));
    state = favoritesReducer(state, clearFavorites());
    expect(state.items).toHaveLength(0);
  });
});
