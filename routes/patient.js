const express = require("express");
const PatientController = require("../controllers/patient");
const Patient = require("../models/patient");
const validatetoken = require("../middleware/validateTokenhandler");

const PatientRouter = express.Router();

PatientRouter.get("/", PatientController.getAll);

PatientRouter.get("/:id", PatientController.getById);

PatientRouter.post("/", validatetoken, PatientController.create);

PatientRouter.post("/:id/appointment", PatientController.bookAppointment);

PatientRouter.post("/:id/medication", PatientController.addMedication);
PatientRouter.post("/:id/test", PatientController.addTest);

PatientRouter.put("/:id", PatientController.updateById);

PatientRouter.delete("/:id", PatientController.deleteById);

module.exports = PatientRouter;
