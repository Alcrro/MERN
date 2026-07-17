const { registerUser, loginUser, logoutUser } = require("../controllers/auth/auth");

jest.mock("../models/auth/register", () => ({
  Register: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
  ROLES: { CLIENT: "client", VENDOR: "vendor", ADMIN: "admin" },
}));

const { Register } = require("../models/auth/register");

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json   = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  return res;
};

const mockReq = (body = {}) => ({ body });

beforeEach(() => jest.clearAllMocks());

describe("registerUser", () => {
  test("returns 400 if name, email or password missing", async () => {
    const next = jest.fn();
    await registerUser(mockReq({ email: "test@test.com" }), mockRes(), next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400 }));
  });

  test("returns 400 if email already registered", async () => {
    Register.findOne.mockResolvedValue({ email: "test@test.com" });
    const next = jest.fn();
    await registerUser(mockReq({ name: "Ion", email: "test@test.com", password: "123456" }), mockRes(), next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400 }));
  });

  test("creates user and responds 201 with token", async () => {
    Register.findOne.mockResolvedValue(null);
    Register.create.mockResolvedValue({
      _id: "abc",
      name: "Ion",
      email: "ion@test.com",
      role: "client",
      getSignedJwtToken: jest.fn().mockReturnValue("tok123"),
    });

    const res = mockRes();
    await registerUser(mockReq({ name: "Ion", email: "ion@test.com", password: "123456" }), res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true, token: "tok123" }));
  });

  test("defaults role to client when an invalid role is passed", async () => {
    Register.findOne.mockResolvedValue(null);
    const fakeCreate = jest.fn().mockResolvedValue({
      _id: "abc", name: "Ion", email: "ion@test.com", role: "client",
      getSignedJwtToken: jest.fn().mockReturnValue("tok"),
    });
    Register.create = fakeCreate;

    await registerUser(mockReq({ name: "Ion", email: "ion@test.com", password: "123456", role: "superuser" }), mockRes(), jest.fn());

    expect(fakeCreate).toHaveBeenCalledWith(expect.objectContaining({ role: "client" }));
  });
});

describe("loginUser", () => {
  test("returns 400 if email or password missing", async () => {
    const next = jest.fn();
    await loginUser(mockReq({ email: "test@test.com" }), mockRes(), next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400 }));
  });

  test("returns 401 if user not found", async () => {
    Register.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(null) });
    const next = jest.fn();
    await loginUser(mockReq({ email: "ghost@test.com", password: "123456" }), mockRes(), next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401 }));
  });

  test("returns 401 if password does not match", async () => {
    Register.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue({ matchPassword: jest.fn().mockResolvedValue(false) }),
    });
    const next = jest.fn();
    await loginUser(mockReq({ email: "ion@test.com", password: "wrong" }), mockRes(), next);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401 }));
  });

  test("responds 200 with token on valid credentials", async () => {
    Register.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue({
        _id: "abc", name: "Ion", email: "ion@test.com", role: "client",
        matchPassword: jest.fn().mockResolvedValue(true),
        getSignedJwtToken: jest.fn().mockReturnValue("tok123"),
      }),
    });
    const res = mockRes();
    await loginUser(mockReq({ email: "ion@test.com", password: "correct" }), res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true, token: "tok123" }));
  });
});

describe("logoutUser", () => {
  test("clears token cookie and returns success", async () => {
    const res = mockRes();
    await logoutUser(mockReq(), res, jest.fn());
    expect(res.cookie).toHaveBeenCalledWith("token", "none", expect.any(Object));
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: {} });
  });
});
