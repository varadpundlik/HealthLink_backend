const Patient = require("../models/patient");

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
      return res.status(404).send("Patient not found");
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
    return res.status(201).send("Patient created");
  } catch (e) {
    return res.status(500).send(e);
  }
};

const updateById = async (req, res) => {
  try {
    const updatedData = { ...req.body };
    const update = await Patient.updateOne({ _id: req.params.id }, updatedData);
    if (!update) {
      return res.status(404).send("Patient not found");
    }
    return res.status(201).send("Patient updated");
  } catch (e) {
    return res.status(500).send(e);
  }
};

const deleteById = async (req, res) => {
  try {
    const deletePatient = await Patient.deleteOne({ _id: req.params.id });
    if (!deletePatient) {
      return res.status(404).send("Patient not found");
    }
    return res.status(200).send("Patient Deleted");
  } catch (e) {
    return res.status(500).send(e);
  }
};

module.exports = { getAll, getById, create, updateById, deleteById };
