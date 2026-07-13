const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const notFoundMiddleware = require("./middleware/middlewareRoutes/not-found");
const cors = require("cors");
const errorHandler = require("./middleware/error/error");
const cookieParser = require("cookie-parser");

const connectDB = require("./configs/mongoDB");

dotenv.config();
connectDB();

const server = express();

server.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: "Too many requests, please try again later." },
});
server.use("/api/auth", limiter);

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());
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
server.use("/api/product/:productId/reviews", require("./routes/review/review"));
server.use("/api/reviews", require("./routes/review/review"));
server.use("/api/product/:productId/stock", require("./routes/stock/stock"));
server.use("/api/admin/product/:productId/stock", require("./routes/stock/stock"));
server.use("/api/orders", require("./routes/order/order"));
server.use("/api/addresses", require("./routes/address/address"));
server.use("/api", require("./routes/vendor/vendor"));
server.use("/api/admin", require("./routes/admin/admin"));
server.use("/api/catalog", require("./routes/catalog/catalog"));
server.use("/api/upload", require("./routes/upload/upload"));
server.use("/api/ecosystem", require("./routes/ecosystem/ecosystem"));
server.use(notFoundMiddleware);

server.use(errorHandler);

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
