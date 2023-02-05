const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const errorHandler = require("./middleware/error/error");
const connectDB = require("./configs/mongoDB");

//Load env vars
dotenv.config({ path: "./backend/configs/.env" });

//Connect to database
connectDB();

const server = express();
server.use(express.json());
// server.use(cookieParser());
server.use(cors());

//Mount routers
server.use("/api/auth", require("./routes/auth/auth"));
server.use("/api/", require("./routes/user/user"));

server.use(errorHandler);

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
