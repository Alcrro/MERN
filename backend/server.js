const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const morgan = require("morgan");
const compression = require("compression");
const notFoundMiddleware = require("./middleware/middlewareRoutes/not-found");
const cors = require("cors");
const errorHandler = require("./middleware/error/error");
const cookieParser = require("cookie-parser");

const connectDB = require("./configs/mongoDB");

dotenv.config();
connectDB();

const server = express();

server.use(helmet());
server.use(compression());

if (process.env.NODE_ENV === "development") {
  server.use(morgan("dev"));
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: "Too many requests, please try again later." },
});
server.use("/api/auth", limiter);

const newsletterLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { success: false, message: "Prea multe cereri. Încearcă din nou în câteva ore." },
});
server.use("/api/newsletter/subscribe", newsletterLimiter);

// webhook Stripe necesită raw body — înregistrat ÎNAINTE de express.json()
server.use("/api/stripe", require("./routes/stripe/stripe"));

server.use(express.json({ limit: "10kb" }));
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());
server.use(mongoSanitize());
server.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
}));


//Mount routers

server.use("/api/categories", require("./routes/categories/categories"));
server.use("/api/auth", require("./routes/auth/auth"));
server.use("/api/users", require("./routes/user/user"));
server.use("/api/", require("./routes/products/products"));
server.use("/api/admin/", require("./routes/productCategory/productCategory"));
server.use("/api/products/:productId/reviews", require("./routes/review/review"));
server.use("/api/reviews", require("./routes/review/review"));
server.use("/api/products/:productId/stock", require("./routes/stock/stock"));
server.use("/api/admin/products/:productId/stock", require("./routes/stock/stock"));
server.use("/api/orders", require("./routes/order/order"));
server.use("/api/addresses", require("./routes/address/address"));
server.use("/api", require("./routes/vendor/vendor"));
server.use("/api/admin", require("./routes/admin/admin"));
server.use("/api/catalog", require("./routes/catalog/catalog"));
server.use("/api/upload", require("./routes/upload/upload"));
server.use("/api/ecosystem", require("./routes/ecosystem/ecosystem"));
server.use("/api/newsletter", require("./routes/newsletter/newsletter"));
server.use("/api/shop-card", require("./routes/shopCard/shopCard"));
server.use("/api/payment-methods", require("./routes/paymentMethods/paymentMethods"));
server.use("/api/vouchers", require("./routes/voucher/voucher"));
server.use(notFoundMiddleware);

server.use(errorHandler);

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
