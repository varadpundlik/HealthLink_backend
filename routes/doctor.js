const express = require("express");
const doctorController = require("../controllers/doctor");
const doctorRouter = express.Router();
const validatetoken=require("../middleware/validateTokenhandler");
doctorRouter.post("/login", doctorController.loginDoctor);
doctorRouter.post("/register", doctorController.registerDoctor);
doctorRouter.get("/current", validatetoken,doctorController.currentDoctor);

module.exports = doctorRouter;
