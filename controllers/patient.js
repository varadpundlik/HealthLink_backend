const Patient = require("../models/patient");
const constants = require("../constant/index");
//const Message = require("../models/message");

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
    
    const { age, contactNumber, healthConditions} = req.body; 
    const updateFields = { age, contactNumber, healthConditions };

    const update = await Patient.findByIdAndUpdate(req.params.id, updateFields, { new: true });

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
const calculateStreaks = async (analytics, userId) => {
  const patient = await Patient.findOne({ user: userId });

  const maxStreaks = {
    medicine: 0,
    water: 0,
    steps: 0,
    sleep: 0,
    calories: 0,
  };

  const currentStreaks = {
    medicine: 0,
    water: 0,
    steps: 0,
    sleep: 0,
    calories: 0,
  };

  analytics.forEach((entry, index) => {
    // Medicine
    if (entry.medicineTaken !== 0 || entry.medicineMissed !== 0) {
      currentStreaks.medicine++;
      maxStreaks.medicine = Math.max(
        maxStreaks.medicine,
        currentStreaks.medicine
      );
    } else {
      currentStreaks.medicine = 0;
    }

    if (entry.waterIntake > patient.analytics_thresholds.water) {
      currentStreaks.water++;
      maxStreaks.water = Math.max(maxStreaks.water, currentStreaks.water);
    } else {
      currentStreaks.water = 0;
    }

    // Steps
    if (entry.stepsWalked > patient.analytics_thresholds.steps) {
      currentStreaks.steps++;
      maxStreaks.steps = Math.max(maxStreaks.steps, currentStreaks.steps);
    } else {
      currentStreaks.steps = 0;
    }

    // Sleep
    if (entry.sleepDuration > patient.analytics_thresholds.sleep) {
      currentStreaks.sleep++;
      maxStreaks.sleep = Math.max(maxStreaks.sleep, currentStreaks.sleep);
    } else {
      currentStreaks.sleep = 0;
    }

    // Calories
    if (entry.caloriesIntake > patient.analytics_thresholds.calories) {
      currentStreaks.calories++;
      maxStreaks.calories = Math.max(
        maxStreaks.calories,
        currentStreaks.calories
      );
    } else {
      currentStreaks.calories = 0;
    }
  });

  return { currentStreaks, maxStreaks };
};

const addAnalytics = async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user.id });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const newAnalytics = {
      ...req.body,
    };

    // Check if patient.analytics exists, if not, initialize it
    if (!patient.analytics) {
      patient.analytics = [];
    }

    patient.analytics.push(newAnalytics);

    // Calculate streaks
    const { currentStreaks, maxStreaks } = await calculateStreaks(
      patient.analytics,
      req.user.id
    );

    // Initialize patient streaks if undefined
    if (!patient.streaks) {
      patient.streaks = {};
    }

    // Initialize patient max streaks if undefined
    if (!patient.maxStreaks) {
      patient.maxStreaks = {};
    }

    // Update patient streaks
    patient.streaks.medicine = currentStreaks.medicine;
    patient.streaks.water = currentStreaks.water;
    patient.streaks.steps = currentStreaks.steps;
    patient.streaks.sleep = currentStreaks.sleep;
    patient.streaks.calories = currentStreaks.calories;

    // Update patient max streaks
    patient.maxStreaks.medicine = maxStreaks.medicine;
    patient.maxStreaks.water = maxStreaks.water;
    patient.maxStreaks.steps = maxStreaks.steps;
    patient.maxStreaks.sleep = maxStreaks.sleep;
    patient.maxStreaks.calories = maxStreaks.calories;



    await patient.save();

    res.status(200).json({ message: "Analytics added successfully", data: patient });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};


const getPatientByToken = async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user.id });
    if (!patient) {
      return res.status(404).send(PATIENT_NOT_FOUND);
    }
    return res.status(200).json(patient);
  } catch (e) {
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
