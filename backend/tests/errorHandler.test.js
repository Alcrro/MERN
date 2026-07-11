const errorHandler = require("../middleware/error/error");
const ErrorResponse = require("../utilitis/errorResponse");

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json   = jest.fn().mockReturnValue(res);
  return res;
};

describe("errorHandler middleware", () => {
  test("returns 500 for unknown errors", () => {
    const err = new Error("Something went wrong");
    const res = mockRes();
    errorHandler(err, {}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
  });

  test("returns statusCode from ErrorResponse", () => {
    const err = new ErrorResponse("Not Found", 404);
    const res = mockRes();
    errorHandler(err, {}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("returns 404 for CastError (bad ObjectId)", () => {
    const err = { name: "CastError", value: "bad-id", message: "Cast error" };
    const res = mockRes();
    errorHandler(err, {}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("returns 400 for Mongoose duplicate key error", () => {
    const err = { code: 11000, message: "Duplicate key" };
    const res = mockRes();
    errorHandler(err, {}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Duplicate field value entered" })
    );
  });

  test("returns 400 for ValidationError", () => {
    const err = {
      name: "ValidationError",
      errors: { email: { message: "Invalid email" } },
      message: "Validation failed",
    };
    const res = mockRes();
    errorHandler(err, {}, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
