const express = require("express");
const doctorController = require("../controllers/doctor");
const doctorRouter = express.Router();
const validatetoken=require("../middleware/validateTokenhandler");
doctorRouter.post("/login", doctorController.loginDoctor);
doctorRouter.post("/register", doctorController.registerDoctor);
doctorRouter.get("/current", validatetoken,doctorController.currentDoctor);
doctorRouter.get("/appointment",validatetoken,doctorController.getAppointment);
doctorRouter.post("/appointment-notes",doctorController.addAppointmentNotes);

module.exports = doctorRouter;
