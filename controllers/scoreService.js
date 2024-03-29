const Patient = require("../models/patient");
const axios = require("axios");

const getEngagementScore = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).send("Patient not found");
    }
    let medicines = [];
    let water = [];
    let sleep = [];
    let steps = [];
    let calories = [];
    patient.analytics.forEach((element) => {
      medicines.push(element.medicineTaken);
      water.push(element.waterIntake);
      sleep.push(element.sleepDuration);
      steps.push(element.stepsWalked);
      calories.push(element.caloriesIntake);
    });
    const data = {
      medicineArray: medicines,
      waterArray: water,
      watersthreshold: patient.analytics_thresholds.water,
      sleepArray: sleep,
      sleepthreshold: patient.analytics_thresholds.sleep,
      stepsArray: steps,
      stepthreshold: patient.analytics_thresholds.steps,
      caloriesArray: calories,
      caloriessthreshold: patient.analytics_thresholds.calories,
    };
    axios
      .post("https://techfista.onrender/com/generate_engagement_score", data)
      .then((response) => {
        res.status(200).send(response.data);
      });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = { getEngagementScore };