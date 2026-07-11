jest.mock("./authService", () => ({
  register: jest.fn(),
  login: jest.fn(),
  logout: jest.fn(),
}));
import authReducer, { reset, register, login, logout } from "./authSlice";

const blank = {
  user: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

beforeEach(() => localStorage.clear());

describe("authSlice reducer", () => {
  test("returns initial state", () => {
    expect(authReducer(undefined, { type: "@@INIT" })).toEqual(blank);
  });

  test("reset clears flags and message", () => {
    const dirty = { ...blank, isError: true, isSuccess: true, isLoading: true, message: "err" };
    expect(authReducer(dirty, reset())).toEqual(blank);
  });

  test("register.pending sets isLoading", () => {
    const state = authReducer(blank, { type: register.pending.type });
    expect(state.isLoading).toBe(true);
  });

  test("register.fulfilled sets user and isSuccess", () => {
    const user = { _id: "1", name: "Ion", role: "client" };
    const state = authReducer(blank, { type: register.fulfilled.type, payload: user });
    expect(state.isSuccess).toBe(true);
    expect(state.user).toEqual(user);
    expect(state.isLoading).toBe(false);
  });

  test("register.rejected sets isError and message", () => {
    const state = authReducer(blank, { type: register.rejected.type, payload: "Email already in use" });
    expect(state.isError).toBe(true);
    expect(state.message).toBe("Email already in use");
    expect(state.user).toBeNull();
  });

  test("login.fulfilled sets user", () => {
    const user = { _id: "2", name: "Maria", role: "vendor" };
    const state = authReducer(blank, { type: login.fulfilled.type, payload: user });
    expect(state.user).toEqual(user);
    expect(state.isSuccess).toBe(true);
  });

  test("login.rejected sets isError", () => {
    const state = authReducer(blank, { type: login.rejected.type, payload: "Invalid credentials" });
    expect(state.isError).toBe(true);
    expect(state.message).toBe("Invalid credentials");
  });

  test("logout.fulfilled clears user", () => {
    const withUser = { ...blank, user: { _id: "1" }, isSuccess: true };
    const state = authReducer(withUser, { type: logout.fulfilled.type });
    expect(state.user).toBeNull();
    expect(state.isSuccess).toBe(false);
  });
});
