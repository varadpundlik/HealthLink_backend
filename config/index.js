const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const config = {
  port: process.env.port || 5000,
  db_host:
    process.env.db_host ||
    "mongodb+srv://medezz:medezz@cluster0.5iplfcy.mongodb.net/",
  Access_token_secret: "medezz123",
};

module.exports = config;
