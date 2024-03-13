const express = require("express");
const doctorController = require("../controllers/doctor");
const doctorRouter = express.Router();

doctorRouter.post("/login", doctorController.loginDoctor);
doctorRouter.post("/register", doctorController.registerDoctor);
doctorRouter.get("/current", doctorController.currentDoctor);

module.exports = doctorRouter;
