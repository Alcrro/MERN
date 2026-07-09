const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { Register } = require("../../models/auth/register");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await Register.findById(decoded.id);
    if (!req.user) {
      res.status(401);
      throw new Error("User no longer exists");
    }
    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, token failed");
  }
});

const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    res.status(403);
    throw new Error(`Role '${req.user?.role}' is not authorized for this action`);
  }
  next();
};

module.exports = { protect, authorize };
