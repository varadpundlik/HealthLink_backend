const express = require("express");
const chatController = require("../controllers/chat");
const validatetoken = require("../middleware/validateTokenhandler");

const chatRouter = express.Router();

chatRouter.get("/:receiverId", validatetoken,chatController.getChatHistory);

module.exports = chatRouter;