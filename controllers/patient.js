const Patient = require("../models/patient");
const constants = require("../constant/index");

const { PATIENT_CREATED, PATIENT_DELETED, PATIENT_NOT_FOUND, PATIENT_UPDATED } =
  constants;

const getAll = async (req, res) => {
  try {
    const patients = await Patient.find();
    return res.status(200).json(patients);
  } catch (e) {
    return res.status(500).send(e);
  }
};

const getById = async (req, res) => {
  try {
    const patients = await Patient.findById(req.params.id);
    if (!patients) {
      return res.status(404).send(PATIENT_NOT_FOUND);
    }
    return res.status(200).json(patients);
  } catch (e) {
    return res.status(500).send(e);
  }
};

const create = async (req, res) => {
  try {
    const patientData = { ...req.body };
    const patient = new Patient(patientData);
    await patient.save();
    return res.status(201).send(PATIENT_CREATED);
  } catch (e) {
    return res.status(500).send(e);
  }
};

const bookAppointment = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).send(PATIENT_NOT_FOUND);
    }
    const appointment = { ...req.body };
    patient.appointments.push(appointment);
    await patient.save();
    return res.status(201).send("Appointment booked successfully");
  } catch (e) {
    return res.status(500).send(e);
  }
};

const addMedication = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).send(PATIENT_NOT_FOUND);
    }
    const medication  = req.body.medication;
    medication.map((med) => {
    patient.medications.push(med);
    });
    await patient.save();
    return res.status(201).send("Medication added successfully");
  } catch (e) {
    return res.status(500).send(e);
  }
};

const updateById = async (req, res) => {
  try {
    const updatedData = { ...req.body };
    const update = await Patient.updateOne({ _id: req.params.id }, updatedData);
    if (!update) {
      return res.status(404).send(PATIENT_NOT_FOUND);
    }
    return res.status(201).send(PATIENT_UPDATED);
  } catch (e) {
    return res.status(500).send(e);
  }
};

const deleteById = async (req, res) => {
  try {
    const deletePatient = await Patient.deleteOne({ _id: req.params.id });
    if (!deletePatient) {
      return res.status(404).send(PATIENT_NOT_FOUND);
    }
    return res.status(200).send(PATIENT_DELETED);
  } catch (e) {
    return res.status(500).send(e);
  }
};

module.exports = { getAll, getById, create, bookAppointment, addMedication, updateById, deleteById };
