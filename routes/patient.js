const express = require("express");
const PatientController = require("../controllers/patient");
const Patient = require("../models/patient");

const PatientRouter = express.Router();

PatientRouter.get("/", PatientController.getAll);

PatientRouter.get("/:id", PatientController.getById);

PatientRouter.post("/", PatientController.create);

PatientRouter.post("/:id/appointment", PatientController.bookAppointment);

PatientRouter.post("/:id/medication", PatientController.addMedication);

PatientRouter.put("/:id", PatientController.updateById);

PatientRouter.delete("/:id", PatientController.deleteById);

module.exports = PatientRouter;
