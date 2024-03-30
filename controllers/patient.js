const Patient = require("../models/patient");
const constants = require("../constant/index");
const Message = require("../models/message");

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
    if (entry.medicineTaken === true) {
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
const axios = require('axios');

function average(arr) {
  if (!arr.length) {
    return 0;
  }
  return arr.reduce((sum, val) => sum + val, 0) / arr.length;
}

function calculateEngagementScore(
  medicationDuration, 
  Scrrentime, 
  calltime, 
  messages
) {
  let scrrenTimeArray = [];
  let callTimeArray = [];
  let medicationArray = [];
  let messageArray = [];
  let n = scrrenTimeArray.length;

  let cnt = 0;
  let score = 0;
  
  for (let i = 0; i < n; i++) 
  {
    if (cnt < 7) {
      cnt = 1;
      let temp = score;
      medicationArray.push(temp);
      score = 0;
      
      if (medicationDuration[i]) {
        score++;
      }
    } else {
      if (medicationDuration[i]) {
        score++;
      }
    }
    
    cnt++;
  }
  cnt=0;
  score=0;
  for (let i = 0; i < n; i++) 
  {
    if (cnt < 7) 
    {
      cnt = 1;
      scrrenTimeArray.push(score/50);
      score =Scrrentime[i] ;
    } else {
        score=score+Scrrentime[i];
        cnt++;
      
    }
  }
  cnt=0;
  score=0;
  for (let i = 0; i < n; i++) 
  {
    if (cnt < 7) 
    {
      cnt = 1;
      callTimeArray.push(score/60);
      score =calltime[i] ;
    } else {
        score=score+calltime[i];
        cnt++;
      
    }
  }
  cnt=0;
  score=0;
  for (let i = 0; i < n; i++) 
  {
    if (cnt < 7) 
    {
      cnt = 1;
      messageArray.push(score/30);
      score =messages[i] ;
    } else {
        score=score+messages[i];
        cnt++;
      
    }
  }
  const medAvg = average(medicationArray);
  const screenAvg = average(scrrenTimeArray);
  const callingAvg = average(callTimeArray);
  const messageAvg = average(messageArray);
  
  const engagementScore = ((medAvg + screenAvg + callingAvg + messageAvg ) / 4) * 10;
  
  return engagementScore;
}
function calculateHealthScore(
  medicationDuration, 
  stepsWalked, 
  caloriesBurned, 
  sleepDuration, 
  waterIntake, 
  step, 
  sleep, 
  water, 
  calories
) {
  let stepsArray = [];
  let sleepArray = [];
  let waterArray = [];
  let caloriesArray = [];
  let medicationArray = [];
  
  let n = stepsWalked.length;
  let cnt = 0;
  let score = 0;
  
  for (let i = 0; i < n; i++) {
    if (cnt < 7) {
      cnt = 1;
      let temp = score / 7;
      medicationArray.push(temp);
      score = 0;
      
      if (medicationDuration[i]) {
        score++;
      }
    } else {
      if (medicationDuration[i]) {
        score++;
      }
    }
    
    cnt++;
  }
  
  for (let i = 0; i < n; i++) {
    let stepsRate = 100;
    let sleepRate = 100;
    let waterRate = 100;
    let caloriesRate = 100;
    
    if (stepsWalked[i] === step) {
      stepsRate = 1;
    } else {
      stepsRate = Math.abs(stepsWalked[i] - step) / step;
    }
    
    if (caloriesBurned[i] === calories) {
      caloriesRate = 1;
    } else {
      caloriesRate = Math.abs(caloriesBurned[i] - calories) / calories;
    }
    
    if (sleepDuration[i] === sleep) {
      sleepRate = 1;
    } else {
      sleepRate = Math.abs(sleepDuration[i] - sleep) / sleep;
    }
    
    if (waterIntake[i] === water) {
      waterRate = 1;
    } else {
      waterRate = Math.abs(waterIntake[i] - water) / water;
    }
    
    stepsArray.push(stepsRate);
    sleepArray.push(sleepRate);
    waterArray.push(waterRate);
    caloriesArray.push(caloriesRate);
  }
  
  const stepsAvg = average(stepsArray);
  const sleepAvg = average(sleepArray);
  const waterAvg = average(waterArray);
  const caloriesAvg = average(caloriesArray);
  const medicationAvg = average(medicationArray);
  
  const healthScore = ((stepsAvg + sleepAvg + waterAvg + caloriesAvg + medicationAvg) / 5) * 10;
  
  return healthScore;
}

const addAnalytics = async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user.id });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const newAnalytics = {
      ...req.body,
    };

    // Calculate message count
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const messageCount = await Message.countDocuments({
      $or: [{ sender: req.user.id }, { receiver: req.user.id }],
      createdAt: { $gte: today },
    });
    newAnalytics.messageCount = messageCount;
    patient.analytics.push(newAnalytics);

    // Calculate streaks
    const { currentStreaks, maxStreaks } = await calculateStreaks(
      patient.analytics,
      req.user.id
    );

    patient.streaks.medicine = currentStreaks.medicine;
    patient.streaks.water = currentStreaks.water;
    patient.streaks.steps = currentStreaks.steps;
    patient.streaks.sleep = currentStreaks.sleep;
    patient.streaks.calories = currentStreaks.calories;

    patient.maxStreaks.medicine = maxStreaks.medicine;
    patient.maxStreaks.water = maxStreaks.water;
    patient.maxStreaks.steps = maxStreaks.steps;
    patient.maxStreaks.sleep = maxStreaks.sleep;
    patient.maxStreaks.calories = maxStreaks.calories;
    let medicines = [];
    let water = [];
    let sleep = [];
    let steps = [];
    let calories = [];
    let screenTime = [];
    let callTime = [];
    let messageCounts = [];
    
    patient.analytics.forEach((element) => {
      if(element.medicineTaken != undefined )medicines.push(element.medicineTaken);
      else medicines.push(false);
      water.push(element.waterIntake);
      sleep.push(element.sleepDuration);
      steps.push(element.stepsWalked);
      calories.push(element.caloriesIntake);
      screenTime.push(element.screenTime);
      callTime.push(element.callTime);
      messageCounts.push(element.messageCount);
    });
    
    const data = {
      medicineDuration: medicines,  
      stepsArray: steps,
      sleepArray: sleep,
      waterArray: water,
      caloriesArray: calories,
      stepthreshold: patient.analytics_thresholds.steps,
      sleepthreshold: patient.analytics_thresholds.sleep,
      watersthreshold: patient.analytics_thresholds.water,
      caloriessthreshold: patient.analytics_thresholds.calories
    };

    const engagementScore = calculateEngagementScore(
      medicines,
      screenTime,
      callTime,
      messageCounts
    );
    
    const response = calculateHealthScore(
      data.medicineDuration,
      data.stepsArray,
      data.caloriesArray,
      data.sleepArray,
      data.waterArray,
      data.stepthreshold,
      data.sleepthreshold,
      data.watersthreshold,
      data.caloriessthreshold
    );
    patient.health_score=response;
    patient.engagement_score=engagementScore;
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
