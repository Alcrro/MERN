const ErrorResponse = require("../utilitis/errorResponse");

describe("ErrorResponse", () => {
  test("is an instance of Error", () => {
    const err = new ErrorResponse("Not Found", 404);
    expect(err).toBeInstanceOf(Error);
  });

  test("stores message correctly", () => {
    const err = new ErrorResponse("Unauthorized", 401);
    expect(err.message).toBe("Unauthorized");
  });

  test("stores statusCode correctly", () => {
    const err = new ErrorResponse("Server Error", 500);
    expect(err.statusCode).toBe(500);
  });

  test("different instances are independent", () => {
    const err1 = new ErrorResponse("Not Found", 404);
    const err2 = new ErrorResponse("Forbidden", 403);
    expect(err1.statusCode).toBe(404);
    expect(err2.statusCode).toBe(403);
  });
});
