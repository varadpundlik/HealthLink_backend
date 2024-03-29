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
    patientData.user = req.user.id;
    const patient = new Patient(patientData);
    await patient.save();
    return res.status(201).send(PATIENT_CREATED);
  } catch (e) {
    return res.status(500).send(e);
  }
};

const bookAppointment = async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user.id });
    if (!patient) {
      return res.status(404).send("Patient not found");
    }

    const mypatient = { ...req.body };
    patient.appointments.push(mypatient);
    await patient.save();

    return res.status(201).send("Appointment booked successfully");
  } catch (e) {
    return res.status(500).send(e.message);
  }
};

const addMedication = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).send(PATIENT_NOT_FOUND);
    }
    const medication = req.body.medication;
    medication.map((med) => {
      patient.medications.push(med);
    });
    await patient.save();
    return res.status(201).send("Medication added successfully");
  } catch (e) {
    return res.status(500).send(e);
  }
};
const addTest = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const { test_name, test_date, test_result } = req.body;

    const newTestResult = {
      test_name,
      test_date,
      test_result,
    };

    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    patient.test_results.push(newTestResult);
    await patient.save();

    res.status(201).json({
      message: "Test result added successfully",
      testResult: newTestResult,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding test result", error: error.message });
  }
};

const updateById = async (req, res) => {
  try {
    const { id } = req.params;
    const { age, contactNumber, healthConditions} = req.body; 
    const updateFields = { age, contactNumber, healthConditions };

    const update = await Patient.findByIdAndUpdate(id, updateFields, { new: true });

    if (!update) {
      return res.status(404).send(PATIENT_NOT_FOUND);
    }

    return res.status(200).send(PATIENT_UPDATED);
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
const calculateStreak = (streaks, value, previousDate) => {
  const currentDate = new Date();
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

  if (value > 0 && previousDate) {
    const diffDays = Math.round(Math.abs((currentDate - new Date(previousDate)) / oneDay));
    
    if (diffDays === 1) {
      streaks += 1;
    } else if (diffDays > 1) {
      streaks = 1;
    }
  } else {
    streaks = 0;
  }
  
  return streaks;
};
const addAnalytics = async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user.id });
    
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    } 
    console.log(patient.id)
    
    const newAnalytics = {
      ...req.body,
    };

    // Check if patient.analytics exists, if not, initialize it
    if (!patient.analytics) {
      patient.analytics = [];
    }

    patient.analytics.push(newAnalytics);

    // Calculate maxStreak and currentStreak day-wise
    // const fieldsToCalculate = ['medicineTaken', 'waterIntake', 'stepsWalked', 'sleepDuration', 'caloriesIntake'];
    
    // fieldsToCalculate.forEach(field => {
    //   patient.streaks[field] = calculateStreak(patient.streaks[field], newAnalytics[field], patient.analytics[patient.analytics.length - 2]?.date);
    //   patient.maxStraks[field] = Math.max(patient.maxStraks[field], patient.streaks[field]);
    // });
    await patient.save();
    console.log(patient)

    return res.status(201).json({
      message: "Analytics data added successfully",
      data: newAnalytics,
    });
  } catch (e) {
    return res.status(500).json({ message: "Error adding analytics data", error: e.message });
  }

};

const getPatientByToken = async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user.id });
    if (!patient) {
      return res.status(404).send(PATIENT_NOT_FOUND);
    }
    return res.status(200).json(patient);
  }
  catch (e) {
    return res.status(500).send(e);
  }
};



const checkIfPatientExists = async (req, res) => {
  try {
   
    const existingPatient = await Patient.findOne({ user: req.user.id });
    if (existingPatient) {
      
      return res.status(200).json({ exists: true });
    } else {
      
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error('Error checking if patient exists:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { checkIfPatientExists };



module.exports = {
  getAll,
  getById,
  getPatientByToken,
  create,
  bookAppointment,
  addMedication,
  updateById,
  deleteById,
  addTest,
  getPatientByToken,
  addAnalytics,
  checkIfPatientExists
};
