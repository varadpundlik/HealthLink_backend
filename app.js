const express = require("express");
const config = require("./config");
const constant = require("./constant");
const routes = require("./routes");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("ws"); // Use ws instead of socket.io
const { handleUpgrade } = require("./controllers/chat"); // Import the handleUpgrade function

const app = express();
const server = http.createServer(app);
const port = config.port;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => res.send(constant.message));
routes(app);

// WebSocket upgrade request handling
server.on("upgrade", handleUpgrade);

server.listen(port, () => console.log(`Server running on port ${port}`));

mongoose
  .connect(config.db_host)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));
